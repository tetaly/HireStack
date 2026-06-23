<?php

namespace App\Controller\Api;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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

    #[Route('/generate-cv', name: 'api_seeker_profile_generate_cv', methods: ['POST'])]
    public function generateCv(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser($request);

        if ($user === null || $user['role'] !== 'seeker') {
            return $this->apiError('Acces refuse.', JsonResponse::HTTP_FORBIDDEN);
        }

        $profile = $this->getProfilePayload((int) $user['id']);
        $fallbackCv = $this->generateLocalCv($profile);
        $apiKey = $this->getEnvValue('OPENAI_API_KEY');

        if ($apiKey === null) {
            return $this->apiResponse([
                'cv' => $fallbackCv,
                'provider' => 'local',
            ]);
        }

        try {
            $generatedCv = $this->generateCvWithOpenAi($profile, $apiKey);

            return $this->apiResponse([
                'cv' => $generatedCv,
                'provider' => 'openai',
            ]);
        } catch (\Throwable) {
            return $this->apiResponse([
                'cv' => $fallbackCv,
                'provider' => 'local',
            ]);
        }
    }

    #[Route('/generate-cv.pdf', name: 'api_seeker_profile_generate_cv_pdf', methods: ['POST'])]
    public function generateCvPdf(Request $request): Response
    {
        $user = $this->getAuthenticatedUser($request);

        if ($user === null || $user['role'] !== 'seeker') {
            return $this->apiError('Acces refuse.', JsonResponse::HTTP_FORBIDDEN);
        }

        $profile = $this->getProfilePayload((int) $user['id']);
        $cv = $this->generateCvContent($profile);
        $name = trim(sprintf('%s %s', $profile['user']['firstName'] ?? '', $profile['user']['lastName'] ?? '')) ?: 'cv';
        $filename = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name) ?? 'cv');
        $filename = trim($filename, '-') ?: 'cv';

        return new Response($this->createPdfFromMarkdown($cv), Response::HTTP_OK, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf('attachment; filename="%s-cv.pdf"', $filename),
        ]);
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
     * @param array<string, mixed> $profile
     */
    private function generateCvWithOpenAi(array $profile, string $apiKey): string
    {
        $model = $this->getEnvValue('OPENAI_MODEL') ?? 'gpt-4.1';
        $prompt = "Genere un CV professionnel en francais au format Markdown a partir de ce profil candidat. "
            . "Reste factuel: n'invente pas d'entreprise, de diplome, de date, de certification ou de resultat chiffre. "
            . "Structure: titre, contact, resume professionnel, competences, experience, formation. "
            . "Utilise un ton clair, recruteur, et concis.\n\n"
            . json_encode($profile, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        $body = json_encode([
            'model' => $model,
            'input' => $prompt,
        ], JSON_UNESCAPED_UNICODE);

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => implode("\r\n", [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $apiKey,
                ]),
                'content' => $body,
                'ignore_errors' => true,
                'timeout' => 30,
            ],
        ]);

        $response = file_get_contents('https://api.openai.com/v1/responses', false, $context);

        if ($response === false) {
            throw new \RuntimeException('OpenAI request failed.');
        }

        $decoded = json_decode($response, true);

        if (!is_array($decoded)) {
            throw new \RuntimeException('OpenAI response is invalid.');
        }

        $text = $this->extractOpenAiText($decoded);

        if ($text === '') {
            throw new \RuntimeException('OpenAI response is empty.');
        }

        return $text;
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function generateCvContent(array $profile): string
    {
        $fallbackCv = $this->generateLocalCv($profile);
        $apiKey = $this->getEnvValue('OPENAI_API_KEY');

        if ($apiKey === null) {
            return $fallbackCv;
        }

        try {
            return $this->generateCvWithOpenAi($profile, $apiKey);
        } catch (\Throwable) {
            return $fallbackCv;
        }
    }

    /**
     * @param array<string, mixed> $response
     */
    private function extractOpenAiText(array $response): string
    {
        $parts = [];

        foreach (($response['output'] ?? []) as $output) {
            if (!is_array($output)) {
                continue;
            }

            foreach (($output['content'] ?? []) as $content) {
                if (is_array($content) && ($content['type'] ?? null) === 'output_text') {
                    $parts[] = trim((string) ($content['text'] ?? ''));
                }
            }
        }

        return trim(implode("\n\n", array_filter($parts)));
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function generateLocalCv(array $payload): string
    {
        $user = $payload['user'] ?? [];
        $profile = $payload['profile'] ?? [];
        $skills = $payload['skills'] ?? [];
        $experiences = $payload['experiences'] ?? [];
        $educations = $payload['educations'] ?? [];
        $name = trim(sprintf('%s %s', $user['firstName'] ?? '', $user['lastName'] ?? '')) ?: 'Candidat';
        $headline = trim((string) ($profile['headline'] ?? 'Profil professionnel'));
        $contact = array_filter([
            $user['email'] ?? null,
            $user['phone'] ?? null,
            $profile['location'] ?? null,
        ]);
        $lines = [
            '# ' . $name,
            '',
            '**' . $headline . '**',
            '',
            implode(' · ', $contact),
            '',
            '## Resume professionnel',
            '',
            trim((string) ($profile['bio'] ?? 'Profil candidat disponible pour de nouvelles opportunites.')),
            '',
            '## Competences',
            '',
            $skills === [] ? '- Competences a completer' : '- ' . implode("\n- ", array_map('strval', $skills)),
            '',
            '## Experience',
            '',
        ];

        if ($experiences === []) {
            $lines[] = '- Experience a completer';
        }

        foreach ($experiences as $experience) {
            if (!is_array($experience)) {
                continue;
            }

            $period = $this->formatCvPeriod($experience['startDate'] ?? null, $experience['endDate'] ?? null, !empty($experience['isCurrent']));
            $lines[] = sprintf('### %s - %s', $experience['title'] ?? 'Poste', $experience['companyName'] ?? 'Entreprise');
            $lines[] = $period;
            $lines[] = trim((string) ($experience['description'] ?? ''));
            $lines[] = '';
        }

        $lines[] = '## Formation';
        $lines[] = '';

        if ($educations === []) {
            $lines[] = '- Formation a completer';
        }

        foreach ($educations as $education) {
            if (!is_array($education)) {
                continue;
            }

            $years = array_filter([$education['startYear'] ?? null, $education['endYear'] ?? null]);
            $lines[] = sprintf('### %s - %s', $education['degree'] ?? 'Diplome', $education['schoolName'] ?? 'Ecole');
            $lines[] = implode(' - ', $years);
            $field = trim((string) ($education['fieldOfStudy'] ?? ''));

            if ($field !== '') {
                $lines[] = $field;
            }

            $description = trim((string) ($education['description'] ?? ''));

            if ($description !== '') {
                $lines[] = $description;
            }

            $lines[] = '';
        }

        return trim(implode("\n", $lines)) . "\n";
    }

    private function formatCvPeriod(mixed $startDate, mixed $endDate, bool $isCurrent): string
    {
        $start = trim((string) $startDate);
        $end = $isCurrent ? "Aujourd'hui" : trim((string) $endDate);

        if ($start === '' && $end === '') {
            return '';
        }

        return trim($start . ' - ' . $end, ' -');
    }

    private function createPdfFromMarkdown(string $markdown): string
    {
        $document = $this->parseCvMarkdown($markdown);
        $pages = $this->renderCvPages($document);

        $objects = [];
        $catalogId = 1;
        $pagesId = 2;
        $regularFontId = 3;
        $boldFontId = 4;
        $nextId = 5;
        $pageIds = [];

        $objects[$regularFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
        $objects[$boldFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

        foreach ($pages as $content) {
            $contentId = $nextId++;
            $pageId = $nextId++;
            $objects[$contentId] = sprintf("<< /Length %d >>\nstream\n%s\nendstream", strlen($content), $content);
            $objects[$pageId] = sprintf(
                '<< /Type /Page /Parent %d 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 %d 0 R /F2 %d 0 R >> >> /Contents %d 0 R >>',
                $pagesId,
                $regularFontId,
                $boldFontId,
                $contentId,
            );
            $pageIds[] = $pageId;
        }

        $objects[$catalogId] = sprintf('<< /Type /Catalog /Pages %d 0 R >>', $pagesId);
        $objects[$pagesId] = sprintf(
            '<< /Type /Pages /Kids [%s] /Count %d >>',
            implode(' ', array_map(fn (int $id) => $id . ' 0 R', $pageIds)),
            count($pageIds),
        );

        ksort($objects);

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $id => $object) {
            $offsets[$id] = strlen($pdf);
            $pdf .= $id . " 0 obj\n" . $object . "\nendobj\n";
        }

        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
        $pdf .= "0000000000 65535 f \n";

        for ($id = 1; $id <= count($objects); ++$id) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$id]);
        }

        $pdf .= "trailer\n";
        $pdf .= sprintf("<< /Size %d /Root %d 0 R >>\n", count($objects) + 1, $catalogId);
        $pdf .= "startxref\n" . $xrefOffset . "\n%%EOF";

        return $pdf;
    }

    /**
     * @return array{name: string, headline: string, contact: string, sections: array<int, array{title: string, lines: string[]}>}
     */
    private function parseCvMarkdown(string $markdown): array
    {
        $name = 'CV';
        $headline = '';
        $contact = '';
        $sections = [];
        $currentSection = null;
        $beforeSections = [];

        foreach (preg_split('/\R/', $markdown) ?: [] as $rawLine) {
            $line = trim($rawLine);

            if ($line === '') {
                continue;
            }

            if (str_starts_with($line, '# ')) {
                $name = $this->cleanMarkdownText(substr($line, 2));
                continue;
            }

            if (str_starts_with($line, '## ')) {
                if ($currentSection !== null) {
                    $sections[] = $currentSection;
                }

                $currentSection = [
                    'title' => $this->cleanMarkdownText(substr($line, 3)),
                    'lines' => [],
                ];
                continue;
            }

            if ($currentSection === null) {
                $beforeSections[] = $this->cleanMarkdownText($line);
            } else {
                $currentSection['lines'][] = $line;
            }
        }

        if ($currentSection !== null) {
            $sections[] = $currentSection;
        }

        if (isset($beforeSections[0])) {
            $headline = $beforeSections[0];
        }

        if (isset($beforeSections[1])) {
            $contact = $beforeSections[1];
        }

        return [
            'name' => $name,
            'headline' => $headline,
            'contact' => $contact,
            'sections' => $sections,
        ];
    }

    /**
     * @param array{name: string, headline: string, contact: string, sections: array<int, array{title: string, lines: string[]}>} $document
     *
     * @return string[]
     */
    private function renderCvPages(array $document): array
    {
        $pages = [];
        $content = $this->drawRectangle(0, 742, 595, 100, [0.05, 0.2, 0.45]);
        $content .= $this->drawText($document['name'], 48, 800, 24, 'F2', [1, 1, 1]);
        $content .= $this->drawText($document['headline'], 50, 776, 12, 'F1', [0.9, 0.95, 1]);
        $content .= $this->drawText($document['contact'], 50, 756, 10, 'F1', [0.85, 0.9, 0.98]);

        $y = 710;

        foreach ($document['sections'] as $section) {
            $estimatedHeight = $this->estimateSectionHeight($section);

            if ($y - $estimatedHeight < 55) {
                $pages[] = $content;
                $content = $this->drawText($document['name'], 50, 805, 11, 'F2', [0.05, 0.2, 0.45]);
                $content .= $this->drawLine(50, 790, 545, 790, [0.82, 0.86, 0.92]);
                $y = 760;
            }

            $this->renderSection($content, $y, $section);
        }

        $pages[] = $content;

        return $pages;
    }

    /**
     * @param array{title: string, lines: string[]} $section
     */
    private function renderSection(string &$content, float &$y, array $section): void
    {
        $title = $this->cleanMarkdownText($section['title']);
        $content .= $this->drawText($title, 50, $y, 13, 'F2', [0.05, 0.2, 0.45]);
        $content .= $this->drawLine(50, $y - 8, 545, $y - 8, [0.78, 0.84, 0.92]);
        $y -= 28;

        $normalizedTitle = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $title);
        $normalizedTitle = strtolower($normalizedTitle === false ? $title : $normalizedTitle);
        $isSkillsSection = str_contains($normalizedTitle, 'compet');

        if ($isSkillsSection) {
            $this->renderSkills($content, $y, $section['lines']);

            return;
        }

        foreach ($section['lines'] as $rawLine) {
            $line = trim($rawLine);

            if ($line === '') {
                $y -= 6;
                continue;
            }

            if (str_starts_with($line, '### ')) {
                $y -= 4;
                $content .= $this->drawText($this->cleanMarkdownText(substr($line, 4)), 50, $y, 12, 'F2', [0.08, 0.1, 0.16]);
                $y -= 18;
                continue;
            }

            $isBullet = str_starts_with($line, '- ');
            $text = $this->cleanMarkdownText($isBullet ? substr($line, 2) : $line);
            $x = $isBullet ? 64 : 50;
            $maxChars = $isBullet ? 82 : 88;

            foreach ($this->wrapPdfLine($text, $maxChars) as $index => $wrappedLine) {
                if ($isBullet && $index === 0) {
                    $content .= $this->drawText('•', 50, $y, 10, 'F1', [0.05, 0.2, 0.45]);
                }

                $content .= $this->drawText($wrappedLine, $x, $y, 10, 'F1', [0.22, 0.27, 0.35]);
                $y -= 14;
            }
        }

        $y -= 14;
    }

    /**
     * @param string[] $lines
     */
    private function renderSkills(string &$content, float &$y, array $lines): void
    {
        $skills = [];

        foreach ($lines as $line) {
            $line = trim($line);

            if (str_starts_with($line, '- ')) {
                $skills[] = $this->cleanMarkdownText(substr($line, 2));
            } elseif ($line !== '') {
                $skills[] = $this->cleanMarkdownText($line);
            }
        }

        $columns = [50, 300];
        $index = 0;

        foreach ($skills as $skill) {
            $x = $columns[$index % 2];

            if ($index > 0 && $index % 2 === 0) {
                $y -= 24;
            }

            $content .= $this->drawRectangle($x, $y - 13, 210, 20, [0.94, 0.97, 1]);
            $content .= $this->drawText($skill, $x + 10, $y - 7, 9, 'F2', [0.05, 0.2, 0.45]);
            ++$index;
        }

        if ($skills !== []) {
            $y -= 36;
        }
    }

    /**
     * @param array{title: string, lines: string[]} $section
     */
    private function estimateSectionHeight(array $section): int
    {
        $height = 40;

        foreach ($section['lines'] as $line) {
            $line = trim($line);

            if ($line === '') {
                $height += 6;
            } elseif (str_starts_with($line, '### ')) {
                $height += 22;
            } elseif (str_starts_with($line, '- ')) {
                $height += 14 * count($this->wrapPdfLine(substr($line, 2), 82));
            } else {
                $height += 14 * count($this->wrapPdfLine($line, 88));
            }
        }

        return $height + 20;
    }

    private function cleanMarkdownText(string $text): string
    {
        return trim(str_replace(['**', '`'], '', $text));
    }

    /**
     * @param float[] $rgb
     */
    private function drawText(string $text, float $x, float $y, int $size, string $font, array $rgb): string
    {
        return sprintf(
            "BT /%s %d Tf %.3F %.3F %.3F rg %.2F %.2F Td (%s) Tj ET\n",
            $font,
            $size,
            $rgb[0],
            $rgb[1],
            $rgb[2],
            $x,
            $y,
            $this->escapePdfText($text),
        );
    }

    /**
     * @param float[] $rgb
     */
    private function drawRectangle(float $x, float $y, float $width, float $height, array $rgb): string
    {
        return sprintf(
            "q %.3F %.3F %.3F rg %.2F %.2F %.2F %.2F re f Q\n",
            $rgb[0],
            $rgb[1],
            $rgb[2],
            $x,
            $y,
            $width,
            $height,
        );
    }

    /**
     * @param float[] $rgb
     */
    private function drawLine(float $x1, float $y1, float $x2, float $y2, array $rgb): string
    {
        return sprintf(
            "q %.3F %.3F %.3F RG 0.8 w %.2F %.2F m %.2F %.2F l S Q\n",
            $rgb[0],
            $rgb[1],
            $rgb[2],
            $x1,
            $y1,
            $x2,
            $y2,
        );
    }

    /**
     * @return string[]
     */
    private function wrapPdfLine(string $line, int $maxChars): array
    {
        $words = preg_split('/\s+/', $line) ?: [];
        $wrapped = [];
        $current = '';

        foreach ($words as $word) {
            $candidate = trim($current . ' ' . $word);

            if (strlen($candidate) > $maxChars && $current !== '') {
                $wrapped[] = $current;
                $current = $word;
            } else {
                $current = $candidate;
            }
        }

        if ($current !== '') {
            $wrapped[] = $current;
        }

        return $wrapped === [] ? [''] : $wrapped;
    }

    private function escapePdfText(string $text): string
    {
        $encoded = iconv('UTF-8', 'Windows-1252//TRANSLIT//IGNORE', $text);
        $encoded = $encoded === false ? $text : $encoded;

        return str_replace(
            ["\\", "(", ")", "\r", "\n"],
            ["\\\\", "\\(", "\\)", '', ''],
            $encoded,
        );
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

    private function getEnvValue(string $key): ?string
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

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
