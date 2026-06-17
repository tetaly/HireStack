<?php

namespace App\Controller\Api;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/seeker/profile')]
final class SeekerProfileController extends AbstractApiController
{
    public function __construct(private readonly Connection $connection)
    {
    }

    #[Route('', name: 'api_seeker_profile_show', methods: ['GET'])]
    public function show(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser($request);

        if ($user === null || $user['role'] !== 'seeker') {
            return $this->apiError('Acces refuse.', JsonResponse::HTTP_FORBIDDEN);
        }

        return $this->apiResponse($this->getProfilePayload((int) $user['id']));
    }

    #[Route('', name: 'api_seeker_profile_update', methods: ['PUT'])]
    public function update(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser($request);

        if ($user === null || $user['role'] !== 'seeker') {
            return $this->apiError('Acces refuse.', JsonResponse::HTTP_FORBIDDEN);
        }

        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return $this->apiError('Payload invalide.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $profileId = $this->ensureProfile((int) $user['id']);
        $profile = $payload['profile'] ?? [];
        $userPayload = $payload['user'] ?? [];

        $this->connection->beginTransaction();

        try {
            $this->connection->update('seeker_profiles', [
                'headline' => $this->stringOrNull($profile['headline'] ?? null),
                'location' => $this->stringOrNull($profile['location'] ?? null),
                'bio' => $this->stringOrNull($profile['bio'] ?? null),
                'years_experience' => $this->intOrNull($profile['yearsExperience'] ?? null),
                'onboarding_completed' => 1,
            ], ['id' => $profileId]);

            if (array_key_exists('avatarUrl', $userPayload) && is_string($userPayload['avatarUrl'])) {
                $this->connection->update('users', [
                    'avatar_url' => $this->stringOrNull($userPayload['avatarUrl']),
                ], ['id' => (int) $user['id']]);
            }

            $userUpdates = [];
            foreach ([
                'firstName' => 'first_name',
                'lastName' => 'last_name',
                'email' => 'email',
                'phone' => 'phone',
            ] as $payloadKey => $column) {
                if (array_key_exists($payloadKey, $userPayload)) {
                    $userUpdates[$column] = $this->stringOrNull($userPayload[$payloadKey]);
                }
            }

            if ($userUpdates !== []) {
                $this->connection->update('users', $userUpdates, ['id' => (int) $user['id']]);
            }

            $this->replaceSkills($profileId, $payload['skills'] ?? []);
            $this->replaceExperiences($profileId, $payload['experiences'] ?? []);
            $this->replaceEducations($profileId, $payload['educations'] ?? []);

            $this->connection->commit();

            return $this->apiResponse($this->getProfilePayload((int) $user['id']));
        } catch (\Throwable) {
            $this->connection->rollBack();

            return $this->apiError('Impossible de sauvegarder le profil.', JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function ensureProfile(int $userId): int
    {
        $profileId = $this->connection->fetchOne('SELECT id FROM seeker_profiles WHERE user_id = ?', [$userId]);

        if ($profileId !== false) {
            return (int) $profileId;
        }

        $this->connection->insert('seeker_profiles', [
            'user_id' => $userId,
            'availability_status' => 'available',
            'onboarding_completed' => 0,
        ]);

        return (int) $this->connection->lastInsertId();
    }

    /**
     * @return array<string, mixed>
     */
    private function getProfilePayload(int $userId): array
    {
        $user = $this->connection->fetchAssociative('SELECT id, email, first_name, last_name, phone, avatar_url, role, status FROM users WHERE id = ?', [$userId]);
        $profileId = $this->ensureProfile($userId);
        $profile = $this->connection->fetchAssociative('SELECT * FROM seeker_profiles WHERE id = ?', [$profileId]);

        return [
            'user' => [
                'id' => (int) $user['id'],
                'email' => $user['email'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'phone' => $user['phone'],
                'avatarUrl' => $user['avatar_url'],
                'role' => $user['role'],
                'status' => $user['status'],
                'profileCompleted' => (bool) ($profile['onboarding_completed'] ?? false),
            ],
            'profile' => [
                'headline' => $profile['headline'],
                'location' => $profile['location'],
                'bio' => $profile['bio'],
                'yearsExperience' => $profile['years_experience'] === null ? null : (int) $profile['years_experience'],
                'availabilityStatus' => $profile['availability_status'],
            ],
            'skills' => $this->connection->fetchFirstColumn(
                'SELECT s.name FROM seeker_skills ss INNER JOIN skills s ON s.id = ss.skill_id WHERE ss.seeker_profile_id = ? ORDER BY s.name',
                [$profileId],
            ),
            'experiences' => $this->connection->fetchAllAssociative(
                'SELECT title, company_name AS companyName, description, start_date AS startDate, end_date AS endDate, is_current AS isCurrent FROM seeker_experiences WHERE seeker_profile_id = ? ORDER BY position_order, id',
                [$profileId],
            ),
            'educations' => $this->connection->fetchAllAssociative(
                'SELECT degree, school_name AS schoolName, field_of_study AS fieldOfStudy, start_year AS startYear, end_year AS endYear, description FROM seeker_educations WHERE seeker_profile_id = ? ORDER BY position_order, id',
                [$profileId],
            ),
        ];
    }

    /**
     * @param mixed[] $skills
     */
    private function replaceSkills(int $profileId, array $skills): void
    {
        $this->connection->delete('seeker_skills', ['seeker_profile_id' => $profileId]);

        foreach ($skills as $skill) {
            $name = trim((string) $skill);

            if ($name === '') {
                continue;
            }

            $slug = $this->slugify($name);
            $skillId = $this->connection->fetchOne('SELECT id FROM skills WHERE slug = ?', [$slug]);

            if ($skillId === false) {
                $this->connection->insert('skills', ['name' => $name, 'slug' => $slug]);
                $skillId = (int) $this->connection->lastInsertId();
            }

            $this->connection->insert('seeker_skills', [
                'seeker_profile_id' => $profileId,
                'skill_id' => (int) $skillId,
            ]);
        }
    }

    /**
     * @param mixed[] $experiences
     */
    private function replaceExperiences(int $profileId, array $experiences): void
    {
        $this->connection->delete('seeker_experiences', ['seeker_profile_id' => $profileId]);

        foreach ($experiences as $index => $experience) {
            if (!is_array($experience) || trim((string) ($experience['title'] ?? '')) === '') {
                continue;
            }

            $this->connection->insert('seeker_experiences', [
                'seeker_profile_id' => $profileId,
                'title' => trim((string) $experience['title']),
                'company_name' => trim((string) ($experience['companyName'] ?? '')),
                'description' => $this->stringOrNull($experience['description'] ?? null),
                'start_date' => $this->dateOrNull($experience['startDate'] ?? null),
                'end_date' => $this->dateOrNull($experience['endDate'] ?? null),
                'is_current' => !empty($experience['isCurrent']) ? 1 : 0,
                'position_order' => $index,
            ]);
        }
    }

    /**
     * @param mixed[] $educations
     */
    private function replaceEducations(int $profileId, array $educations): void
    {
        $this->connection->delete('seeker_educations', ['seeker_profile_id' => $profileId]);

        foreach ($educations as $index => $education) {
            if (!is_array($education) || trim((string) ($education['degree'] ?? '')) === '') {
                continue;
            }

            $this->connection->insert('seeker_educations', [
                'seeker_profile_id' => $profileId,
                'degree' => trim((string) $education['degree']),
                'school_name' => trim((string) ($education['schoolName'] ?? '')),
                'field_of_study' => $this->stringOrNull($education['fieldOfStudy'] ?? null),
                'start_year' => $this->intOrNull($education['startYear'] ?? null),
                'end_year' => $this->intOrNull($education['endYear'] ?? null),
                'description' => $this->stringOrNull($education['description'] ?? null),
                'position_order' => $index,
            ]);
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    private function getAuthenticatedUser(Request $request): ?array
    {
        $header = $request->headers->get('Authorization', '');

        if (!str_starts_with($header, 'Bearer ')) {
            return null;
        }

        $token = trim(substr($header, 7));

        if ($token === '') {
            return null;
        }

        $user = $this->connection->fetchAssociative(
            'SELECT u.* FROM auth_tokens t INNER JOIN users u ON u.id = t.user_id WHERE t.token_hash = ? AND t.expires_at > NOW()',
            [hash('sha256', $token)],
        );

        return $user === false ? null : $user;
    }

    private function stringOrNull(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function intOrNull(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    private function dateOrNull(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function slugify(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9]+/i', '-', $value) ?? '';
        $value = trim($value, '-');

        return $value === '' ? 'skill' : $value;
    }
}
