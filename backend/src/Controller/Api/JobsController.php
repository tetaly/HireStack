<?php

namespace App\Controller\Api;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class JobsController extends AbstractApiController
{
    public function __construct(private readonly Connection $connection)
    {
    }

    #[Route('/api/jobs', name: 'api_jobs_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $query = trim((string) $request->query->get('q', ''));
        $location = trim((string) $request->query->get('location', ''));
        $type = trim((string) $request->query->get('type', ''));
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(1, (int) $request->query->get('limit', 12)));
        $offset = ($page - 1) * $limit;

        $where = ['j.status = "active"'];
        $params = [];

        if ($query !== '') {
            $where[] = '(j.title LIKE ? OR c.name LIKE ? OR j.category LIKE ?)';
            $like = '%' . $query . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        if ($location !== '') {
            $where[] = 'j.location LIKE ?';
            $params[] = '%' . $location . '%';
        }

        if ($type !== '' && strtolower($type) !== 'tous') {
            $where[] = 'j.contract_type = ?';
            $params[] = strtolower($type);
        }

        $total = (int) $this->connection->fetchOne(
            sprintf(
                'SELECT COUNT(*) FROM jobs j INNER JOIN companies c ON c.id = j.company_id WHERE %s',
                implode(' AND ', $where),
            ),
            $params,
        );

        $jobs = $this->connection->fetchAllAssociative(
            sprintf(
                'SELECT j.*, c.name AS company_name FROM jobs j INNER JOIN companies c ON c.id = j.company_id WHERE %s ORDER BY j.featured DESC, j.published_at DESC, j.created_at DESC LIMIT %d OFFSET %d',
                implode(' AND ', $where),
                $limit,
                $offset,
            ),
            $params,
        );

        return $this->apiResponse([
            'jobs' => array_map(fn (array $job) => $this->formatJob($job), $jobs),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => max(1, (int) ceil($total / $limit)),
            ],
        ]);
    }

    #[Route('/api/jobs/{id}', name: 'api_jobs_show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $job = $this->findJob($id);

        if ($job === null || $job['status'] !== 'active') {
            return $this->apiError('Offre introuvable.', JsonResponse::HTTP_NOT_FOUND);
        }

        $this->connection->executeStatement('UPDATE jobs SET views_count = views_count + 1 WHERE id = ?', [$id]);

        return $this->apiResponse([
            'job' => $this->formatJob($job, true),
            'related' => $this->getRelatedJobs($job),
        ]);
    }

    #[Route('/api/jobs/categories', name: 'api_jobs_categories', methods: ['GET'])]
    public function categories(): JsonResponse
    {
        $categories = $this->connection->fetchAllAssociative(
            'SELECT j.category AS name, COUNT(*) AS jobs_count
             FROM jobs j
             WHERE j.status = "active" AND j.category IS NOT NULL AND j.category != ""
             GROUP BY j.category
             ORDER BY jobs_count DESC, j.category ASC',
        );

        return $this->apiResponse([
            'categories' => array_map(
                fn (array $category) => [
                    'name' => $category['name'],
                    'count' => (int) $category['jobs_count'],
                ],
                $categories,
            ),
        ]);
    }

    #[Route('/api/recruiter/jobs', name: 'api_recruiter_jobs_index', methods: ['GET'])]
    public function recruiterIndex(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser($request);

        if ($user === null || $user['role'] !== 'recruiter') {
            return $this->apiError('Acces refuse.', JsonResponse::HTTP_FORBIDDEN);
        }

        $jobs = $this->connection->fetchAllAssociative(
            'SELECT j.*, c.name AS company_name FROM jobs j INNER JOIN companies c ON c.id = j.company_id WHERE j.recruiter_id = ? ORDER BY j.created_at DESC',
            [(int) $user['id']],
        );

        return $this->apiResponse([
            'jobs' => array_map(fn (array $job) => $this->formatJob($job, true), $jobs),
        ]);
    }

    #[Route('/api/recruiter/jobs', name: 'api_recruiter_jobs_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser($request);

        if ($user === null || $user['role'] !== 'recruiter') {
            return $this->apiError('Acces refuse.', JsonResponse::HTTP_FORBIDDEN);
        }

        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return $this->apiError('Payload invalide.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $title = trim((string) ($payload['title'] ?? ''));
        $contractType = strtolower(trim((string) ($payload['contractType'] ?? '')));
        $location = trim((string) ($payload['location'] ?? ''));
        $description = trim((string) ($payload['description'] ?? ''));

        if ($title === '' || $contractType === '' || $location === '' || $description === '') {
            return $this->apiError('Titre, contrat, localisation et description sont obligatoires.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $companyId = $this->connection->fetchOne(
            'SELECT company_id FROM company_members WHERE user_id = ? ORDER BY id ASC LIMIT 1',
            [(int) $user['id']],
        );

        if ($companyId === false) {
            return $this->apiError('Aucune entreprise associee a ce recruteur.', JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $slug = $this->uniqueJobSlug($title);
        $status = ($payload['status'] ?? 'active') === 'draft' ? 'draft' : 'active';
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        $this->connection->beginTransaction();

        try {
            $this->connection->insert('jobs', [
                'company_id' => (int) $companyId,
                'recruiter_id' => (int) $user['id'],
                'title' => $title,
                'slug' => $slug,
                'category' => $this->stringOrNull($payload['category'] ?? null),
                'contract_type' => $contractType,
                'location' => $location,
                'work_mode' => $this->stringOrNull($payload['workMode'] ?? null),
                'salary_min' => $this->intOrNull($payload['salaryMin'] ?? null),
                'salary_max' => $this->intOrNull($payload['salaryMax'] ?? null),
                'salary_currency' => 'EUR',
                'description' => $description,
                'profile_required' => $this->stringOrNull($payload['profileRequired'] ?? null),
                'benefits' => $this->stringOrNull($payload['benefits'] ?? null),
                'status' => $status,
                'featured' => 0,
                'published_at' => $status === 'active' ? $now : null,
            ]);

            $jobId = (int) $this->connection->lastInsertId();
            $this->replaceJobSkills($jobId, $payload['skills'] ?? []);

            $this->connection->commit();

            return $this->apiResponse([
                'job' => $this->formatJob($this->findJob($jobId), true),
            ], JsonResponse::HTTP_CREATED);
        } catch (\Throwable) {
            $this->connection->rollBack();

            return $this->apiError('Impossible de creer l offre.', JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    private function findJob(int $id): ?array
    {
        $job = $this->connection->fetchAssociative(
            'SELECT j.*, c.name AS company_name FROM jobs j INNER JOIN companies c ON c.id = j.company_id WHERE j.id = ?',
            [$id],
        );

        return $job === false ? null : $job;
    }

    /**
     * @param array<string, mixed> $job
     *
     * @return array<string, mixed>
     */
    private function formatJob(array $job, bool $detailed = false): array
    {
        $jobId = (int) $job['id'];
        $tags = $this->connection->fetchFirstColumn(
            'SELECT s.name FROM job_skills js INNER JOIN skills s ON s.id = js.skill_id WHERE js.job_id = ? ORDER BY s.name',
            [$jobId],
        );

        $data = [
            'id' => (string) $jobId,
            'title' => $job['title'],
            'company' => $job['company_name'],
            'location' => $job['location'],
            'type' => strtoupper((string) $job['contract_type']),
            'salary' => $this->formatSalary($job),
            'tags' => $tags,
            'posted' => $this->formatPosted($job['published_at'] ?? $job['created_at']),
            'featured' => (bool) $job['featured'],
            'category' => $job['category'],
            'status' => $job['status'],
            'views' => (int) $job['views_count'],
            'applications' => (int) $job['applications_count'],
        ];

        if ($detailed) {
            $data += [
                'description' => $job['description'],
                'profileRequired' => $job['profile_required'],
                'benefits' => $job['benefits'],
                'salaryMin' => $job['salary_min'] === null ? null : (int) $job['salary_min'],
                'salaryMax' => $job['salary_max'] === null ? null : (int) $job['salary_max'],
                'workMode' => $job['work_mode'],
            ];
        }

        return $data;
    }

    /**
     * @param array<string, mixed> $job
     *
     * @return array<int, array<string, mixed>>
     */
    private function getRelatedJobs(array $job): array
    {
        if ($job['category'] === null) {
            return [];
        }

        $jobs = $this->connection->fetchAllAssociative(
            'SELECT j.*, c.name AS company_name FROM jobs j INNER JOIN companies c ON c.id = j.company_id WHERE j.id != ? AND j.status = "active" AND j.category = ? ORDER BY j.published_at DESC LIMIT 3',
            [(int) $job['id'], $job['category']],
        );

        return array_map(fn (array $relatedJob) => $this->formatJob($relatedJob), $jobs);
    }

    /**
     * @param mixed[] $skills
     */
    private function replaceJobSkills(int $jobId, array $skills): void
    {
        $this->connection->delete('job_skills', ['job_id' => $jobId]);

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

            $this->connection->insert('job_skills', [
                'job_id' => $jobId,
                'skill_id' => (int) $skillId,
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

    private function uniqueJobSlug(string $title): string
    {
        $base = $this->slugify($title);
        $slug = $base;
        $suffix = 2;

        while ($this->connection->fetchOne('SELECT id FROM jobs WHERE slug = ?', [$slug]) !== false) {
            $slug = $base . '-' . $suffix;
            ++$suffix;
        }

        return $slug;
    }

    private function slugify(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9]+/i', '-', $value) ?? '';
        $value = trim($value, '-');

        return $value === '' ? 'job' : $value;
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

    /**
     * @param array<string, mixed> $job
     */
    private function formatSalary(array $job): string
    {
        if ($job['salary_min'] === null && $job['salary_max'] === null) {
            return 'Salaire non precise';
        }

        $min = $job['salary_min'] === null ? null : (int) round(((int) $job['salary_min']) / 1000);
        $max = $job['salary_max'] === null ? null : (int) round(((int) $job['salary_max']) / 1000);

        if ($min !== null && $max !== null) {
            return sprintf('%d-%dk €', $min, $max);
        }

        if ($min !== null) {
            return sprintf('Dès %dk €', $min);
        }

        return sprintf("Jusqu'a %dk €", $max);
    }

    private function formatPosted(?string $date): string
    {
        if ($date === null) {
            return 'recemment';
        }

        $posted = new \DateTimeImmutable($date);
        $now = new \DateTimeImmutable();
        $days = (int) $posted->diff($now)->format('%a');

        if ($days === 0) {
            return "aujourd'hui";
        }

        return 'il y a ' . $days . 'j';
    }
}
