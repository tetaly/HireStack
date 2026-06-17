<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123700CreateJobViews extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create job_views table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE job_views (
            id INT AUTO_INCREMENT NOT NULL,
            job_id INT NOT NULL,
            user_id INT DEFAULT NULL,
            ip_hash VARCHAR(100) DEFAULT NULL,
            viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX IDX_JOB_VIEWS_JOB (job_id),
            INDEX IDX_JOB_VIEWS_USER (user_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE job_views ADD CONSTRAINT FK_JOB_VIEWS_JOB FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE job_views ADD CONSTRAINT FK_JOB_VIEWS_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE job_views DROP FOREIGN KEY FK_JOB_VIEWS_USER');
        $this->addSql('ALTER TABLE job_views DROP FOREIGN KEY FK_JOB_VIEWS_JOB');
        $this->addSql('DROP TABLE job_views');
    }
}
