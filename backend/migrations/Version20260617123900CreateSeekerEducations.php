<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123900CreateSeekerEducations extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create seeker_educations table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE seeker_educations (
            id INT AUTO_INCREMENT NOT NULL,
            seeker_profile_id INT NOT NULL,
            degree VARCHAR(180) NOT NULL,
            school_name VARCHAR(180) NOT NULL,
            field_of_study VARCHAR(180) DEFAULT NULL,
            start_year SMALLINT DEFAULT NULL,
            end_year SMALLINT DEFAULT NULL,
            description LONGTEXT DEFAULT NULL,
            position_order SMALLINT NOT NULL DEFAULT 0,
            INDEX IDX_SEEKER_EDUCATIONS_PROFILE (seeker_profile_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE seeker_educations ADD CONSTRAINT FK_SEEKER_EDUCATIONS_PROFILE FOREIGN KEY (seeker_profile_id) REFERENCES seeker_profiles (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE seeker_educations DROP FOREIGN KEY FK_SEEKER_EDUCATIONS_PROFILE');
        $this->addSql('DROP TABLE seeker_educations');
    }
}
