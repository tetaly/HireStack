<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617124000AddOnboardingCompletedToSeekerProfiles extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add onboarding_completed to seeker_profiles';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE seeker_profiles ADD onboarding_completed TINYINT(1) NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE seeker_profiles DROP onboarding_completed');
    }
}
