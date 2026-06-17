<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617124100ChangeUserAvatarUrlToLongText extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Change users avatar_url to LONGTEXT';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE users MODIFY avatar_url LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE users MODIFY avatar_url VARCHAR(255) DEFAULT NULL');
    }
}
