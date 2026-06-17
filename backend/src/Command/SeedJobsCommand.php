<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-jobs',
    description: 'Seed realistic companies and job offers for local development.',
)]
final class SeedJobsCommand extends Command
{
    public function __construct(private readonly Connection $connection)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('count', null, InputOption::VALUE_REQUIRED, 'Number of additional generated job offers to create.', 0);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $created = 0;
        $count = max(0, (int) $input->getOption('count'));
        $jobs = array_merge($this->jobs(), $this->generatedJobs($count));

        foreach ($jobs as $job) {
            $companyId = $this->findOrCreateCompany($job['company']);
            $slug = $this->slugify($job['title']);

            if ($this->connection->fetchOne('SELECT id FROM jobs WHERE slug = ?', [$slug]) !== false) {
                continue;
            }

            $this->connection->insert('jobs', [
                'company_id' => $companyId,
                'recruiter_id' => null,
                'title' => $job['title'],
                'slug' => $slug,
                'category' => $job['category'],
                'contract_type' => $job['contractType'],
                'location' => $job['location'],
                'work_mode' => $job['workMode'],
                'salary_min' => $job['salaryMin'],
                'salary_max' => $job['salaryMax'],
                'salary_currency' => 'EUR',
                'description' => $job['description'],
                'profile_required' => $job['profileRequired'],
                'benefits' => $job['benefits'],
                'status' => 'active',
                'featured' => $job['featured'] ? 1 : 0,
                'published_at' => (new \DateTimeImmutable($job['publishedAt']))->format('Y-m-d H:i:s'),
            ]);

            $jobId = (int) $this->connection->lastInsertId();
            $this->replaceJobSkills($jobId, $job['skills']);
            ++$created;
        }

        $io->success(sprintf('%d offres creees.', $created));

        return Command::SUCCESS;
    }

    private function findOrCreateCompany(array $company): int
    {
        $slug = $this->slugify($company['name']);
        $companyId = $this->connection->fetchOne('SELECT id FROM companies WHERE slug = ?', [$slug]);

        if ($companyId !== false) {
            return (int) $companyId;
        }

        $this->connection->insert('companies', [
            'name' => $company['name'],
            'slug' => $slug,
            'industry' => $company['industry'],
            'location' => $company['location'],
            'size_range' => $company['size'],
            'description' => $company['description'],
            'website' => $company['website'],
            'founded_year' => $company['foundedYear'],
            'status' => 'active',
        ]);

        return (int) $this->connection->lastInsertId();
    }

    private function replaceJobSkills(int $jobId, array $skills): void
    {
        $this->connection->delete('job_skills', ['job_id' => $jobId]);

        foreach ($skills as $skill) {
            $slug = $this->slugify($skill);
            $skillId = $this->connection->fetchOne('SELECT id FROM skills WHERE slug = ?', [$slug]);

            if ($skillId === false) {
                $this->connection->insert('skills', [
                    'name' => $skill,
                    'slug' => $slug,
                ]);
                $skillId = (int) $this->connection->lastInsertId();
            }

            $this->connection->insert('job_skills', [
                'job_id' => $jobId,
                'skill_id' => (int) $skillId,
            ]);
        }
    }

    private function slugify(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9]+/i', '-', $value) ?? '';
        $value = trim($value, '-');

        return $value === '' ? 'item' : $value;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function generatedJobs(int $count): array
    {
        if ($count === 0) {
            return [];
        }

        $roles = [
            ['title' => 'Developpeur Symfony', 'category' => 'Tech', 'skills' => ['Symfony', 'PHP', 'MySQL', 'API REST'], 'salary' => [24000, 42000]],
            ['title' => 'Developpeur React', 'category' => 'Tech', 'skills' => ['React', 'TypeScript', 'Tailwind CSS', 'Figma'], 'salary' => [22000, 39000]],
            ['title' => 'Developpeur Full Stack', 'category' => 'Tech', 'skills' => ['React', 'Node.js', 'PostgreSQL', 'Docker'], 'salary' => [28000, 50000]],
            ['title' => 'Backend Developer', 'category' => 'Tech', 'skills' => ['Laravel', 'PHP', 'PostgreSQL', 'Redis'], 'salary' => [26000, 46000]],
            ['title' => 'DevOps Engineer', 'category' => 'Tech', 'skills' => ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], 'salary' => [38000, 68000]],
            ['title' => 'Data Analyst', 'category' => 'Data', 'skills' => ['SQL', 'Power BI', 'Python', 'Excel'], 'salary' => [18000, 34000]],
            ['title' => 'Data Engineer', 'category' => 'Data', 'skills' => ['Python', 'Airflow', 'BigQuery', 'SQL'], 'salary' => [34000, 62000]],
            ['title' => 'UX/UI Designer', 'category' => 'Design', 'skills' => ['Figma', 'UX Research', 'Design System', 'Prototypage'], 'salary' => [20000, 42000]],
            ['title' => 'Product Manager', 'category' => 'Produit', 'skills' => ['Roadmap', 'Agile', 'Analytics', 'Discovery'], 'salary' => [35000, 65000]],
            ['title' => 'Chef de Projet Digital', 'category' => 'Gestion', 'skills' => ['Scrum', 'Jira', 'Communication', 'Budget'], 'salary' => [24000, 44000]],
            ['title' => 'Growth Marketing Manager', 'category' => 'Marketing', 'skills' => ['SEO', 'Google Ads', 'Analytics', 'CRM'], 'salary' => [22000, 45000]],
            ['title' => 'Commercial B2B', 'category' => 'Commercial', 'skills' => ['Prospection', 'CRM', 'Negociation', 'Reporting'], 'salary' => [18000, 36000]],
            ['title' => 'Customer Success Manager', 'category' => 'Support', 'skills' => ['Onboarding', 'SaaS', 'Support client', 'CRM'], 'salary' => [22000, 40000]],
            ['title' => 'QA Tester', 'category' => 'Tech', 'skills' => ['Tests fonctionnels', 'Cypress', 'Postman', 'Jira'], 'salary' => [18000, 32000]],
            ['title' => 'Stage Developpeur Web', 'category' => 'Tech', 'skills' => ['JavaScript', 'HTML', 'CSS', 'Git'], 'salary' => [5000, 9000]],
        ];

        $companies = [
            ['name' => 'Atlas Digital', 'industry' => 'Tech / SaaS', 'location' => 'Casablanca', 'size' => '50-200', 'website' => 'atlasdigital.ma', 'foundedYear' => 2018],
            ['name' => 'BluePixel Studio', 'industry' => 'Design / Produit', 'location' => 'Rabat', 'size' => '10-50', 'website' => 'bluepixel.ma', 'foundedYear' => 2020],
            ['name' => 'FinCore Africa', 'industry' => 'Fintech', 'location' => 'Casablanca', 'size' => '20-50', 'website' => 'fincore.africa', 'foundedYear' => 2019],
            ['name' => 'MarketFlow', 'industry' => 'Marketing / Data', 'location' => 'Marrakech', 'size' => '10-50', 'website' => 'marketflow.ma', 'foundedYear' => 2021],
            ['name' => 'Nova Product Lab', 'industry' => 'Product Design', 'location' => 'Tanger', 'size' => '10-50', 'website' => 'novalab.design', 'foundedYear' => 2017],
            ['name' => 'CloudBridge', 'industry' => 'Cloud / Infrastructure', 'location' => 'Casablanca', 'size' => '50-200', 'website' => 'cloudbridge.io', 'foundedYear' => 2016],
            ['name' => 'GrowthWave', 'industry' => 'Agence digitale', 'location' => 'Rabat', 'size' => '20-50', 'website' => 'growthwave.ma', 'foundedYear' => 2015],
            ['name' => 'CodeStart', 'industry' => 'EdTech', 'location' => 'Fes', 'size' => '1-10', 'website' => 'codestart.ma', 'foundedYear' => 2022],
            ['name' => 'MedinaTech', 'industry' => 'E-commerce', 'location' => 'Marrakech', 'size' => '50-200', 'website' => 'medinatech.ma', 'foundedYear' => 2014],
            ['name' => 'Harbor Systems', 'industry' => 'Logistique', 'location' => 'Tanger', 'size' => '200-500', 'website' => 'harborsystems.ma', 'foundedYear' => 2012],
        ];

        $cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fes', 'Agadir', 'Kenitra', 'Oujda', 'Tetouan', 'Remote'];
        $contracts = ['cdi', 'cdd', 'stage', 'freelance'];
        $workModes = ['onsite', 'hybride', 'remote'];
        $jobs = [];

        for ($i = 1; $i <= $count; ++$i) {
            $role = $roles[($i - 1) % count($roles)];
            $company = $companies[($i - 1) % count($companies)];
            $city = $cities[($i - 1) % count($cities)];
            $contractType = $contracts[($i - 1) % count($contracts)];
            $workMode = $workModes[($i - 1) % count($workModes)];
            $salaryMin = $role['salary'][0] + (($i % 5) * 1000);
            $salaryMax = $role['salary'][1] + (($i % 6) * 1500);

            if ($contractType === 'stage') {
                $salaryMin = min($salaryMin, 7000);
                $salaryMax = min($salaryMax, 12000);
            }

            $jobs[] = [
                'title' => sprintf('%s %s %03d', $role['title'], $city, $i),
                'company' => $company + [
                    'description' => sprintf('%s recrute des talents pour accompagner sa croissance au Maroc et a l international.', $company['name']),
                ],
                'location' => $city . ($workMode === 'remote' ? ' · Remote' : ($workMode === 'hybride' ? ' · Hybride' : '')),
                'contractType' => $contractType,
                'workMode' => $workMode,
                'category' => $role['category'],
                'salaryMin' => $salaryMin,
                'salaryMax' => $salaryMax,
                'skills' => $role['skills'],
                'description' => sprintf('Vous rejoignez %s pour travailler sur des projets %s avec une equipe produit et technique.', $company['name'], strtolower($role['category'])),
                'profileRequired' => sprintf('Experience ou projets concrets en %s. Autonomie, communication et envie de progresser sont importantes.', implode(', ', array_slice($role['skills'], 0, 3))),
                'benefits' => 'Equipe collaborative, formation continue, horaires flexibles et perspectives d evolution.',
                'featured' => $i <= 12,
                'publishedAt' => sprintf('-%d hours', $i + 8),
            ];
        }

        return $jobs;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function jobs(): array
    {
        return [
            [
                'title' => 'Développeur Full Stack Symfony React',
                'company' => [
                    'name' => 'Atlas Digital',
                    'industry' => 'Tech / SaaS',
                    'location' => 'Casablanca',
                    'size' => '50-200',
                    'website' => 'atlasdigital.ma',
                    'foundedYear' => 2018,
                    'description' => 'Atlas Digital construit des plateformes web B2B pour les entreprises marocaines et europeennes.',
                ],
                'location' => 'Casablanca · Hybride',
                'contractType' => 'cdi',
                'workMode' => 'hybride',
                'category' => 'Tech',
                'salaryMin' => 28000,
                'salaryMax' => 42000,
                'skills' => ['Symfony', 'React', 'MySQL', 'REST API'],
                'description' => 'Vous developpez des fonctionnalites backend Symfony et des interfaces React pour une plateforme SaaS en croissance.',
                'profileRequired' => '2+ ans d experience avec PHP/Symfony, React et bases SQL. Bon niveau en API REST.',
                'benefits' => 'Mode hybride, budget formation, mutuelle, tickets restaurant.',
                'featured' => true,
                'publishedAt' => '-2 hours',
            ],
            [
                'title' => 'Frontend Developer React',
                'company' => [
                    'name' => 'BluePixel Studio',
                    'industry' => 'Design / Produit',
                    'location' => 'Rabat',
                    'size' => '10-50',
                    'website' => 'bluepixel.ma',
                    'foundedYear' => 2020,
                    'description' => 'Studio produit specialise dans les experiences digitales pour startups et PME.',
                ],
                'location' => 'Rabat · Remote partiel',
                'contractType' => 'cdi',
                'workMode' => 'hybride',
                'category' => 'Tech',
                'salaryMin' => 24000,
                'salaryMax' => 36000,
                'skills' => ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
                'description' => 'Vous creez des interfaces modernes, maintenables et performantes en collaboration avec les designers produit.',
                'profileRequired' => 'Bonne maitrise de React, composants reutilisables, integration responsive et attention aux details UI.',
                'benefits' => 'Remote partiel, horaires flexibles, materiel fourni.',
                'featured' => true,
                'publishedAt' => '-5 hours',
            ],
            [
                'title' => 'Backend Developer Laravel',
                'company' => [
                    'name' => 'FinCore Africa',
                    'industry' => 'Fintech',
                    'location' => 'Casablanca',
                    'size' => '20-50',
                    'website' => 'fincore.africa',
                    'foundedYear' => 2019,
                    'description' => 'FinCore Africa developpe des outils financiers pour PME et independants.',
                ],
                'location' => 'Casablanca',
                'contractType' => 'cdi',
                'workMode' => 'onsite',
                'category' => 'Tech',
                'salaryMin' => 30000,
                'salaryMax' => 48000,
                'skills' => ['Laravel', 'PHP', 'PostgreSQL', 'Docker'],
                'description' => 'Vous participez au developpement d APIs securisees pour des produits fintech.',
                'profileRequired' => 'Experience Laravel, modelisation de donnees, tests et bonnes pratiques de securite.',
                'benefits' => 'Assurance, primes, environnement produit.',
                'featured' => false,
                'publishedAt' => '-1 day',
            ],
            [
                'title' => 'Data Analyst Junior',
                'company' => [
                    'name' => 'MarketFlow',
                    'industry' => 'Marketing / Data',
                    'location' => 'Marrakech',
                    'size' => '10-50',
                    'website' => 'marketflow.ma',
                    'foundedYear' => 2021,
                    'description' => 'Agence data marketing orientee performance commerciale et analytics.',
                ],
                'location' => 'Marrakech · Hybride',
                'contractType' => 'cdi',
                'workMode' => 'hybride',
                'category' => 'Data',
                'salaryMin' => 18000,
                'salaryMax' => 28000,
                'skills' => ['SQL', 'Power BI', 'Excel', 'Python'],
                'description' => 'Vous analysez les donnees marketing, creez des dashboards et accompagnez les equipes acquisition.',
                'profileRequired' => 'Bon niveau SQL, esprit analytique, bases en visualisation de donnees.',
                'benefits' => 'Formation continue, environnement jeune, projets varies.',
                'featured' => false,
                'publishedAt' => '-2 days',
            ],
            [
                'title' => 'UX/UI Designer Product',
                'company' => [
                    'name' => 'Nova Product Lab',
                    'industry' => 'Product Design',
                    'location' => 'Tanger',
                    'size' => '10-50',
                    'website' => 'novalab.design',
                    'foundedYear' => 2017,
                    'description' => 'Equipe design produit qui accompagne les startups dans la conception d interfaces.',
                ],
                'location' => 'Tanger · Remote',
                'contractType' => 'freelance',
                'workMode' => 'remote',
                'category' => 'Design',
                'salaryMin' => 35000,
                'salaryMax' => 55000,
                'skills' => ['Figma', 'UX Research', 'Design System', 'Prototypage'],
                'description' => 'Vous concevez des parcours utilisateurs, prototypes et design systems pour des produits web et mobile.',
                'profileRequired' => 'Portfolio solide, autonomie, experience en recherche utilisateur.',
                'benefits' => 'Remote, missions internationales, flexibilite.',
                'featured' => false,
                'publishedAt' => '-3 days',
            ],
            [
                'title' => 'DevOps Engineer Cloud',
                'company' => [
                    'name' => 'CloudBridge',
                    'industry' => 'Cloud / Infrastructure',
                    'location' => 'Casablanca',
                    'size' => '50-200',
                    'website' => 'cloudbridge.io',
                    'foundedYear' => 2016,
                    'description' => 'CloudBridge accompagne les entreprises dans leur migration et exploitation cloud.',
                ],
                'location' => 'Casablanca · Hybride',
                'contractType' => 'cdi',
                'workMode' => 'hybride',
                'category' => 'Tech',
                'salaryMin' => 42000,
                'salaryMax' => 65000,
                'skills' => ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                'description' => 'Vous automatisez les deploiements, surveillez les environnements et ameliorez la fiabilite cloud.',
                'profileRequired' => 'Experience Docker/Kubernetes, pipelines CI/CD et monitoring.',
                'benefits' => 'Certifications cloud, primes, remote partiel.',
                'featured' => false,
                'publishedAt' => '-4 days',
            ],
            [
                'title' => 'Chef de Projet Digital',
                'company' => [
                    'name' => 'GrowthWave',
                    'industry' => 'Agence digitale',
                    'location' => 'Rabat',
                    'size' => '20-50',
                    'website' => 'growthwave.ma',
                    'foundedYear' => 2015,
                    'description' => 'Agence digitale qui pilote des projets web, e-commerce et acquisition.',
                ],
                'location' => 'Rabat',
                'contractType' => 'cdd',
                'workMode' => 'onsite',
                'category' => 'Gestion',
                'salaryMin' => 26000,
                'salaryMax' => 38000,
                'skills' => ['Agile', 'Jira', 'Scrum', 'Communication'],
                'description' => 'Vous coordonnez les equipes design, tech et marketing pour livrer des projets digitaux.',
                'profileRequired' => 'Organisation, communication client, experience agile.',
                'benefits' => 'Projets varies, primes objectifs, equipe pluridisciplinaire.',
                'featured' => false,
                'publishedAt' => '-5 days',
            ],
            [
                'title' => 'Stage Développeur Web',
                'company' => [
                    'name' => 'CodeStart',
                    'industry' => 'EdTech',
                    'location' => 'Fes',
                    'size' => '1-10',
                    'website' => 'codestart.ma',
                    'foundedYear' => 2022,
                    'description' => 'Startup edtech qui construit des outils d apprentissage du code.',
                ],
                'location' => 'Fes · Hybride',
                'contractType' => 'stage',
                'workMode' => 'hybride',
                'category' => 'Tech',
                'salaryMin' => 6000,
                'salaryMax' => 9000,
                'skills' => ['JavaScript', 'HTML', 'CSS', 'Git'],
                'description' => 'Vous contribuez a des fonctionnalites web simples et apprenez les bonnes pratiques en equipe.',
                'profileRequired' => 'Bases solides en web, envie d apprendre, portfolio ou projets personnels apprecies.',
                'benefits' => 'Mentorat, horaires flexibles, possibilite de pre-embauche.',
                'featured' => false,
                'publishedAt' => '-6 days',
            ],
        ];
    }
}
