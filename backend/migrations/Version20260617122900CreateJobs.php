<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617122900CreateJobs extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create jobs table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE jobs (
            id INT AUTO_INCREMENT NOT NULL,
            company_id INT NOT NULL,
            recruiter_id INT DEFAULT NULL,
            title VARCHAR(180) NOT NULL,
            slug VARCHAR(220) NOT NULL,
            category VARCHAR(80) DEFAULT NULL,
            contract_type VARCHAR(40) NOT NULL,
            location VARCHAR(150) NOT NULL,
            work_mode VARCHAR(40) DEFAULT NULL,
            salary_min INT DEFAULT NULL,
            salary_max INT DEFAULT NULL,
            salary_currency VARCHAR(10) NOT NULL DEFAULT "EUR",
            description LONGTEXT NOT NULL,
            profile_required LONGTEXT DEFAULT NULL,
            benefits LONGTEXT DEFAULT NULL,
            status VARCHAR(30) NOT NULL DEFAULT "draft",
            featured TINYINT(1) NOT NULL DEFAULT 0,
            views_count INT NOT NULL DEFAULT 0,
            applications_count INT NOT NULL DEFAULT 0,
            published_at DATETIME DEFAULT NULL,
            expires_at DATETIME DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE INDEX UNIQ_JOBS_SLUG (slug),
            INDEX IDX_JOBS_COMPANY (company_id),
            INDEX IDX_JOBS_RECRUITER (recruiter_id),
            INDEX IDX_JOBS_STATUS (status),
            INDEX IDX_JOBS_SEARCH (title, location, contract_type),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE jobs ADD CONSTRAINT FK_JOBS_COMPANY FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE jobs ADD CONSTRAINT FK_JOBS_RECRUITER FOREIGN KEY (recruiter_id) REFERENCES users (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE jobs DROP FOREIGN KEY FK_JOBS_RECRUITER');
        $this->addSql('ALTER TABLE jobs DROP FOREIGN KEY FK_JOBS_COMPANY');
        $this->addSql('DROP TABLE jobs');
    }
}
