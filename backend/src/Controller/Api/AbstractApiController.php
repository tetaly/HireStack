<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

abstract class AbstractApiController extends AbstractController
{
    protected function apiResponse(mixed $data = null, int $status = JsonResponse::HTTP_OK): JsonResponse
    {
        return $this->json([
            'success' => $status < 400,
            'data' => $data,
        ], $status);
    }

    protected function apiError(string $message, int $status = JsonResponse::HTTP_BAD_REQUEST): JsonResponse
    {
        return $this->json([
            'success' => false,
            'error' => [
                'message' => $message,
            ],
        ], $status);
    }
}
