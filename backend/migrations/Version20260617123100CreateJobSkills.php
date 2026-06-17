<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123100CreateJobSkills extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create job_skills table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE job_skills (
            job_id INT NOT NULL,
            skill_id INT NOT NULL,
            PRIMARY KEY(job_id, skill_id),
            INDEX IDX_JOB_SKILLS_JOB (job_id),
            INDEX IDX_JOB_SKILLS_SKILL (skill_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE job_skills ADD CONSTRAINT FK_JOB_SKILLS_JOB FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE job_skills ADD CONSTRAINT FK_JOB_SKILLS_SKILL FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE job_skills DROP FOREIGN KEY FK_JOB_SKILLS_SKILL');
        $this->addSql('ALTER TABLE job_skills DROP FOREIGN KEY FK_JOB_SKILLS_JOB');
        $this->addSql('DROP TABLE job_skills');
    }
}
