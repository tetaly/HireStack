<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123400CreateApplications extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create applications table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE applications (
            id INT AUTO_INCREMENT NOT NULL,
            job_id INT NOT NULL,
            seeker_id INT NOT NULL,
            cover_letter LONGTEXT DEFAULT NULL,
            resume_url VARCHAR(255) DEFAULT NULL,
            status VARCHAR(40) NOT NULL DEFAULT "new",
            match_score SMALLINT DEFAULT NULL,
            recruiter_note LONGTEXT DEFAULT NULL,
            applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE INDEX UNIQ_APPLICATION_JOB_SEEKER (job_id, seeker_id),
            INDEX IDX_APPLICATIONS_JOB (job_id),
            INDEX IDX_APPLICATIONS_SEEKER (seeker_id),
            INDEX IDX_APPLICATIONS_STATUS (status),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE applications ADD CONSTRAINT FK_APPLICATIONS_JOB FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE applications ADD CONSTRAINT FK_APPLICATIONS_SEEKER FOREIGN KEY (seeker_id) REFERENCES users (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE applications DROP FOREIGN KEY FK_APPLICATIONS_SEEKER');
        $this->addSql('ALTER TABLE applications DROP FOREIGN KEY FK_APPLICATIONS_JOB');
        $this->addSql('DROP TABLE applications');
    }
}
