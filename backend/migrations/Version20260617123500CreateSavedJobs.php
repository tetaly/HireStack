<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123500CreateSavedJobs extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create saved_jobs table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE saved_jobs (
            user_id INT NOT NULL,
            job_id INT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(user_id, job_id),
            INDEX IDX_SAVED_JOBS_USER (user_id),
            INDEX IDX_SAVED_JOBS_JOB (job_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE saved_jobs ADD CONSTRAINT FK_SAVED_JOBS_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE saved_jobs ADD CONSTRAINT FK_SAVED_JOBS_JOB FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE saved_jobs DROP FOREIGN KEY FK_SAVED_JOBS_JOB');
        $this->addSql('ALTER TABLE saved_jobs DROP FOREIGN KEY FK_SAVED_JOBS_USER');
        $this->addSql('DROP TABLE saved_jobs');
    }
}
