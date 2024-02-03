<?php

namespace App\Validator;

use App\Repository\GrantedMailRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class GrantedMailValidator extends ConstraintValidator
{

    public function __construct(
        private readonly GrantedMailRepository $grantedMailRepository)
    {
    }

    /**
     * @inheritDoc
     */
    public function validate(
        mixed $value,
        Constraint $constraint
    ): void
    {
        if (!$constraint instanceof GrantedMail) {
            throw new UnexpectedTypeException($constraint, GrantedMail::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!$this->grantedMailRepository->findOneBy(['mail' => $value])) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', $value)
                ->addViolation();
        }
    }
}