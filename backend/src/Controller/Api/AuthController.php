<?php

namespace App\Controller\Api;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/auth')]
final class AuthController extends AbstractApiController
{
    private const TOKEN_TTL = '+30 days';

    public function __construct(private readonly Connection $connection)
    {
    }

    #[Route('/register', name: 'api_auth_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $payload = $this->getJsonPayload($request);
        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');
        $firstName = trim((string) ($payload['firstName'] ?? ''));
        $lastName = trim((string) ($payload['lastName'] ?? ''));
        $role = (string) ($payload['role'] ?? 'seeker');
        $companyName = trim((string) ($payload['companyName'] ?? ''));

        if (!$this->isValidEmail($email)) {
            return $this->apiError('Email invalide.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (strlen($password) < 8) {
            return $this->apiError('Le mot de passe doit contenir au moins 8 caracteres.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($firstName === '' || $lastName === '') {
            return $this->apiError('Le prenom et le nom sont obligatoires.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (!in_array($role, ['seeker', 'recruiter'], true)) {
            return $this->apiError('Role invalide.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($role === 'recruiter' && $companyName === '') {
            return $this->apiError('Le nom de l entreprise est obligatoire.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->connection->beginTransaction();

        try {
            $this->connection->insert('users', [
                'email' => $email,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'role' => $role,
                'status' => 'active',
            ]);

            $userId = (int) $this->connection->lastInsertId();

            if ($role === 'seeker') {
                $this->connection->insert('seeker_profiles', [
                    'user_id' => $userId,
                    'headline' => null,
                    'availability_status' => 'available',
                ]);
            }

            if ($role === 'recruiter') {
                $companyId = $this->createCompany($companyName);

                $this->connection->insert('company_members', [
                    'user_id' => $userId,
                    'company_id' => $companyId,
                    'member_role' => 'owner',
                ]);
            }

            $auth = $this->createAuthToken($userId);
            $user = $this->findUserById($userId);

            $this->connection->commit();

            return $this->apiResponse([
                'token' => $auth['token'],
                'expiresAt' => $auth['expiresAt'],
                'user' => $this->formatUser($user),
            ], JsonResponse::HTTP_CREATED);
        } catch (UniqueConstraintViolationException) {
            $this->connection->rollBack();

            return $this->apiError('Un compte existe deja avec cet email.', JsonResponse::HTTP_CONFLICT);
        } catch (\Throwable $exception) {
            $this->connection->rollBack();

            return $this->apiError('Impossible de creer le compte.', JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $payload = $this->getJsonPayload($request);
        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');

        $user = $this->findUserByEmail($email);

        if ($user === null || !password_verify($password, (string) $user['password_hash'])) {
            return $this->apiError('Email ou mot de passe incorrect.', JsonResponse::HTTP_UNAUTHORIZED);
        }

        if ($user['status'] !== 'active') {
            return $this->apiError('Ce compte n est pas actif.', JsonResponse::HTTP_FORBIDDEN);
        }

        $auth = $this->createAuthToken((int) $user['id']);
        $this->connection->update('users', ['last_login_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s')], ['id' => $user['id']]);

        return $this->apiResponse([
            'token' => $auth['token'],
            'expiresAt' => $auth['expiresAt'],
            'user' => $this->formatUser($user),
        ]);
    }

    #[Route('/me', name: 'api_auth_me', methods: ['GET'])]
    public function me(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser($request);

        if ($user === null) {
            return $this->apiError('Non authentifie.', JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $this->apiResponse([
            'user' => $this->formatUser($user),
        ]);
    }

    #[Route('/logout', name: 'api_auth_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $token = $this->getBearerToken($request);

        if ($token !== null) {
            $this->connection->delete('auth_tokens', ['token_hash' => hash('sha256', $token)]);
        }

        return $this->apiResponse(['loggedOut' => true]);
    }

    /**
     * @return array<string, mixed>
     */
    private function getJsonPayload(Request $request): array
    {
        $payload = json_decode($request->getContent(), true);

        return is_array($payload) ? $payload : [];
    }

    private function isValidEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    private function createCompany(string $name): int
    {
        $slugBase = $this->slugify($name);
        $slug = $slugBase;
        $suffix = 2;

        while ($this->connection->fetchOne('SELECT id FROM companies WHERE slug = ?', [$slug]) !== false) {
            $slug = $slugBase . '-' . $suffix;
            ++$suffix;
        }

        $this->connection->insert('companies', [
            'name' => $name,
            'slug' => $slug,
            'status' => 'active',
        ]);

        return (int) $this->connection->lastInsertId();
    }

    /**
     * @return array{token: string, expiresAt: string}
     */
    private function createAuthToken(int $userId): array
    {
        $token = bin2hex(random_bytes(32));
        $expiresAt = new \DateTimeImmutable(self::TOKEN_TTL);

        $this->connection->insert('auth_tokens', [
            'user_id' => $userId,
            'token_hash' => hash('sha256', $token),
            'expires_at' => $expiresAt->format('Y-m-d H:i:s'),
        ]);

        return [
            'token' => $token,
            'expiresAt' => $expiresAt->format(\DateTimeInterface::ATOM),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function findUserByEmail(string $email): ?array
    {
        $user = $this->connection->fetchAssociative('SELECT * FROM users WHERE email = ?', [$email]);

        return $user === false ? null : $user;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function findUserById(int $id): ?array
    {
        $user = $this->connection->fetchAssociative('SELECT * FROM users WHERE id = ?', [$id]);

        return $user === false ? null : $user;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function getAuthenticatedUser(Request $request): ?array
    {
        $token = $this->getBearerToken($request);

        if ($token === null) {
            return null;
        }

        $user = $this->connection->fetchAssociative(
            'SELECT u.* FROM auth_tokens t INNER JOIN users u ON u.id = t.user_id WHERE t.token_hash = ? AND t.expires_at > NOW()',
            [hash('sha256', $token)],
        );

        return $user === false ? null : $user;
    }

    private function getBearerToken(Request $request): ?string
    {
        $header = $request->headers->get('Authorization', '');

        if (!str_starts_with($header, 'Bearer ')) {
            return null;
        }

        $token = trim(substr($header, 7));

        return $token === '' ? null : $token;
    }

    /**
     * @param array<string, mixed>|null $user
     *
     * @return array<string, mixed>|null
     */
    private function formatUser(?array $user): ?array
    {
        if ($user === null) {
            return null;
        }

        return [
            'id' => (int) $user['id'],
            'email' => $user['email'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'avatarUrl' => $user['avatar_url'],
            'role' => $user['role'],
            'status' => $user['status'],
            'profileCompleted' => $this->isProfileCompleted($user),
        ];
    }

    /**
     * @param array<string, mixed> $user
     */
    private function isProfileCompleted(array $user): bool
    {
        if ($user['role'] !== 'seeker') {
            return true;
        }

        $completed = $this->connection->fetchOne(
            'SELECT onboarding_completed FROM seeker_profiles WHERE user_id = ?',
            [(int) $user['id']],
        );

        return (bool) $completed;
    }

    private function slugify(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9]+/i', '-', $value) ?? '';
        $value = trim($value, '-');

        return $value === '' ? 'company' : $value;
    }
}
