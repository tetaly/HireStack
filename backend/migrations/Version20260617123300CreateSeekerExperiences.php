<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123300CreateSeekerExperiences extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create seeker_experiences table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE seeker_experiences (
            id INT AUTO_INCREMENT NOT NULL,
            seeker_profile_id INT NOT NULL,
            title VARCHAR(180) NOT NULL,
            company_name VARCHAR(150) NOT NULL,
            description LONGTEXT DEFAULT NULL,
            start_date DATE DEFAULT NULL,
            end_date DATE DEFAULT NULL,
            is_current TINYINT(1) NOT NULL DEFAULT 0,
            position_order SMALLINT NOT NULL DEFAULT 0,
            INDEX IDX_SEEKER_EXPERIENCES_PROFILE (seeker_profile_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE seeker_experiences ADD CONSTRAINT FK_SEEKER_EXPERIENCES_PROFILE FOREIGN KEY (seeker_profile_id) REFERENCES seeker_profiles (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE seeker_experiences DROP FOREIGN KEY FK_SEEKER_EXPERIENCES_PROFILE');
        $this->addSql('DROP TABLE seeker_experiences');
    }
}
