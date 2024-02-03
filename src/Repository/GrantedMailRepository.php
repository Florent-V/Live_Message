<?php

namespace App\Repository;

use App\Entity\GrantedMail;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GrantedMail>
 *
 * @method GrantedMail|null find($id, $lockMode = null, $lockVersion = null)
 * @method GrantedMail|null findOneBy(array $criteria, array $orderBy = null)
 * @method GrantedMail[]    findAll()
 * @method GrantedMail[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GrantedMailRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GrantedMail::class);
    }

//    /**
//     * @return GrantedMail[] Returns an array of GrantedMail objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('g.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?GrantedMail
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
