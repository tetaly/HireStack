<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123800CreateAuthTokens extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create auth_tokens table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE auth_tokens (
            id INT AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            token_hash VARCHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE INDEX UNIQ_AUTH_TOKENS_HASH (token_hash),
            INDEX IDX_AUTH_TOKENS_USER (user_id),
            INDEX IDX_AUTH_TOKENS_EXPIRES_AT (expires_at),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE auth_tokens ADD CONSTRAINT FK_AUTH_TOKENS_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE auth_tokens DROP FOREIGN KEY FK_AUTH_TOKENS_USER');
        $this->addSql('DROP TABLE auth_tokens');
    }
}
