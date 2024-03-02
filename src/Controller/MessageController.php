<?php

namespace App\Controller;

use App\Entity\Message;
use App\Form\MessageType;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Liip\ImagineBundle\Service\FilterService;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/message', name: 'app_message_')]
class MessageController extends AbstractController
{
    public function __construct(
        private readonly FilterService $filterService
    ) {
    }
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(
        Request $request,
        EntityManagerInterface $entityManager
    ): Response
    {
        $message = new Message();
        $form = $this->createForm(MessageType::class, $message);
        $form->handleRequest($request);
        //dd($message);

        if ($form->isSubmitted() && $form->isValid()) {
//            $originalFilePath = $message->getImageFile()->getPathname();
//            $newFilePath = 'uploads/images/' . $message->getImageFile()->getClientOriginalName();
//            //dd($originalFilePath, $newFilePath);
//
//            copy($originalFilePath, $newFilePath);
//            $resourcePath = $this->filterService->getUrlOfFilteredImage($newFilePath, 'carre');
//            $substring = strstr($resourcePath, 'media');
//            dd($resourcePath, $substring);
//
//            copy('media/cache/carre/uploads/images/sherlock.jpg', 'uploads/images/test/sherlock.jpg');
//
//            dd($resourcePath);

            //$copy = $message->getImageFile()->copy();
            // $message->setImageFileThumbnail($message->getImageFile());
            $message->setCreatedAt(new \DateTimeImmutable());

            $entityManager->persist($message);
            $entityManager->flush();

            if ($message->getImageFile()) {
                try {
                    $realPath = $message->getImageFile()->getRealPath();
                    $relativePath = strstr($realPath, 'uploads');
                    $thumbPath = $this->filterService->getUrlOfFilteredImage($relativePath, 'my_thumb');
                } catch (Exception $e) {
                    $this->addFlash('warning', 'Il y a eu une erreur avec la génération de la miniature');
                }
            }

            $this->addFlash('success', 'Votre message a bien été envoyé !');

            return $this->redirectToRoute('app_message_new', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('message/new.html.twig', [
            'message' => $message,
            'form' => $form,
        ]);
    }
}
