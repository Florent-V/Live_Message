<?php

namespace App\Service;

use App\Entity\User;

class VerifyAccreditation
{
    public const ALLOWED_MAIL_ADDRESS = [
        'test1@mail.fr',
        'test2@mail.fr',
        'vasseurflorent@mail.com',
        ];

     public function checkEmail(User $user): bool
     {
         if (in_array($user->getEmail(), self::ALLOWED_MAIL_ADDRESS)) {
             return true;
         }
         return false;
     }

}