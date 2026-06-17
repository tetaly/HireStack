<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123200CreateSeekerSkills extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create seeker_skills table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE seeker_skills (
            seeker_profile_id INT NOT NULL,
            skill_id INT NOT NULL,
            PRIMARY KEY(seeker_profile_id, skill_id),
            INDEX IDX_SEEKER_SKILLS_PROFILE (seeker_profile_id),
            INDEX IDX_SEEKER_SKILLS_SKILL (skill_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE seeker_skills ADD CONSTRAINT FK_SEEKER_SKILLS_PROFILE FOREIGN KEY (seeker_profile_id) REFERENCES seeker_profiles (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE seeker_skills ADD CONSTRAINT FK_SEEKER_SKILLS_SKILL FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE seeker_skills DROP FOREIGN KEY FK_SEEKER_SKILLS_SKILL');
        $this->addSql('ALTER TABLE seeker_skills DROP FOREIGN KEY FK_SEEKER_SKILLS_PROFILE');
        $this->addSql('DROP TABLE seeker_skills');
    }
}
