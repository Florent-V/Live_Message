<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class GrantedMail extends Constraint
{
    public string $message = 'The Email Address "{{ string }}" is not granted on this symfony application.';

    // all configurable options must be passed to the constructor
    public function __construct(string $message = null, array $groups = null, $payload = null)
    {
        parent::__construct([], $groups, $payload);

        $this->message = $message ?? $this->message;
    }
}