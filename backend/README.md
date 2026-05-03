# HireStack Backend

Symfony 7.4 API backend for the React frontend.

## Structure

- `src/Controller/Api`: HTTP API controllers.
- `src/Entity`: Doctrine entities.
- `src/Repository`: Doctrine repositories.
- `src/DTO`: request and response data objects.
- `src/Service`: business logic.
- `src/Request`: request-specific models or mappers.
- `src/Response`: response-specific models or factories.
- `migrations`: database migrations.

## Run

```powershell
php -S 127.0.0.1:8000 -t public
```

Health check:

```text
GET http://127.0.0.1:8000/api/health
```

## Database

The default `DATABASE_URL` is configured for XAMPP/MariaDB:

```text
mysql://root:@127.0.0.1:3306/hirestack
```

Create the database before running migrations:

```powershell
php bin/console doctrine:database:create
```
