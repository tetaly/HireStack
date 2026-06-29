<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-users',
    description: 'Seed admin, seeker, and recruiter users for development.',
)]
final class SeedUsersCommand extends Command
{
    public function __construct(private readonly Connection $connection)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $users = [
            [
                'email' => 'admin@hirestack.local',
                'password' => 'AdminPassword123!',
                'first_name' => 'Admin',
                'last_name' => 'User',
                'role' => 'admin',
            ],
            [
                'email' => 'seeker1@hirestack.local',
                'password' => 'SeekerPassword123!',
                'first_name' => 'John',
                'last_name' => 'Seeker',
                'role' => 'seeker',
                'headline' => 'Experienced PHP Developer',
                'location' => 'Paris, France',
                'bio' => 'Passionate software developer with 5 years of experience in backend development.',
                'years_experience' => 5,
            ],
            [
                'email' => 'seeker2@hirestack.local',
                'password' => 'SeekerPassword123!',
                'first_name' => 'Jane',
                'last_name' => 'Seeker',
                'role' => 'seeker',
                'headline' => 'Junior React Developer',
                'location' => 'Lyon, France',
                'bio' => 'Frontend developer eager to build interactive and accessible web applications.',
                'years_experience' => 1,
            ],
            [
                'email' => 'recruiter1@hirestack.local',
                'password' => 'RecruiterPassword123!',
                'first_name' => 'Alice',
                'last_name' => 'Recruiter',
                'role' => 'recruiter',
                'company_name' => 'Tech Corp',
            ],
            [
                'email' => 'recruiter2@hirestack.local',
                'password' => 'RecruiterPassword123!',
                'first_name' => 'Bob',
                'last_name' => 'Recruiter',
                'role' => 'recruiter',
                'company_name' => 'Web Agency',
            ],
        ];

        $created = 0;
        foreach ($users as $userData) {
            $existingId = $this->connection->fetchOne('SELECT id FROM users WHERE email = ?', [$userData['email']]);
            if ($existingId !== false) {
                $io->warning(sprintf('User %s already exists. Skipping.', $userData['email']));
                continue;
            }

            $this->connection->beginTransaction();
            try {
                $this->connection->insert('users', [
                    'email' => $userData['email'],
                    'password_hash' => password_hash($userData['password'], PASSWORD_DEFAULT),
                    'first_name' => $userData['first_name'],
                    'last_name' => $userData['last_name'],
                    'role' => $userData['role'],
                    'status' => 'active',
                ]);
                $userId = (int) $this->connection->lastInsertId();

                if ($userData['role'] === 'seeker') {
                    $this->connection->insert('seeker_profiles', [
                        'user_id' => $userId,
                        'headline' => $userData['headline'],
                        'location' => $userData['location'],
                        'bio' => $userData['bio'],
                        'availability_status' => 'available',
                        'years_experience' => $userData['years_experience'],
                        'onboarding_completed' => 1,
                    ]);
                } elseif ($userData['role'] === 'recruiter') {
                    // Find or create company
                    $slug = $this->slugify($userData['company_name']);
                    $companyId = $this->connection->fetchOne('SELECT id FROM companies WHERE slug = ?', [$slug]);

                    if ($companyId === false) {
                        $this->connection->insert('companies', [
                            'name' => $userData['company_name'],
                            'slug' => $slug,
                            'industry' => 'Technology',
                            'location' => 'Remote',
                            'size_range' => '10-50',
                            'description' => 'A wonderful tech company.',
                            'status' => 'active',
                        ]);
                        $companyId = (int) $this->connection->lastInsertId();
                    } else {
                        $companyId = (int) $companyId;
                    }

                    $this->connection->insert('company_members', [
                        'user_id' => $userId,
                        'company_id' => $companyId,
                        'member_role' => 'owner',
                    ]);
                }

                $this->connection->commit();
                $io->info(sprintf('Created user %s (%s)', $userData['email'], $userData['role']));
                $created++;
            } catch (\Throwable $e) {
                $this->connection->rollBack();
                $io->error(sprintf('Failed to create user %s: %s', $userData['email'], $e->getMessage()));
            }
        }

        $io->success(sprintf('Seeded %d users successfully.', $created));

        return Command::SUCCESS;
    }

    private function slugify(string $text): string
    {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        $text = preg_replace('~[^-\w]+~', '', $text);
        $text = trim($text, '-');
        $text = preg_replace('~-+~', '-', $text);
        $text = strtolower($text);

        return $text === '' ? 'n-a' : $text;
    }
}
