<?php

namespace App\Repository;

use App\Entity\Message;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;

/**
 * @extends ServiceEntityRepository<Message>
 *
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function findMessageAfterId(int $id, ?string $isRead = null)
    {
        $qb = $this->createQueryBuilder('m')
            ->where('m.id > :id')
            ->setParameter('id', $id);

        if ($isRead !== null) {
            $status = $isRead === 'read';
            $qb->andWhere('m.isRead = :isRead')
                ->setParameter('isRead', $status);
        }
        // Ajoutez l'ordre par sur created_at
        $qb->orderBy('m.createdAt', 'ASC');

        return $qb->getQuery()
            ->getResult();
    }

    public function updateReadAt(int $id): void
    {
        $this->createQueryBuilder('m')
            ->update()
            ->set('m.isRead', 'true')
            ->set('m.ReadAt', 'CURRENT_TIMESTAMP()')
            ->where('m.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->execute();
    }

    /**
     * @throws Exception
     */
    public function markReadAt(Message $message): void
    {
        $message->setIsRead(true);
        $message->setReadAt(new DateTimeImmutable());
        $this->getEntityManager()->persist($message);
        $this->getEntityManager()->flush();
    }

//    /**
//     * @return Message[] Returns an array of Message objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Message
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
