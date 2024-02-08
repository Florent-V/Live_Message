<?php

namespace App\DataFixtures;

use App\Entity\Message;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class MessageFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        $date = new \DateTimeImmutable('2024-02-01 00:00:00');

        for ($i = 2; $i <= 10; $i++) {
            $newDate = $date->modify('+'. $i . 'minutes');
            $message = new Message();
            $message->setAuthor($faker->firstName());
            $message->setContent('Message ' . $i-1 . " " . $faker->paragraph());
            $message->setIsRead($faker->boolean());
            $message->setCreatedAt($newDate);
            $manager->persist($message);
        }
        // $product = new Product();
        // $manager->persist($product);
        $manager->flush();
    }
}
