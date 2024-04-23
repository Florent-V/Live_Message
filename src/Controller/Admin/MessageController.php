<?php

namespace App\Controller\Admin;

use App\Entity\Message;
use App\Form\MessageType;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/message', name: 'app_message_')]
class MessageController extends AbstractController
{
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(MessageRepository $messageRepository): Response
    {
        return $this->render('message/index.html.twig', [
            'messages' => $messageRepository->findAll(),
        ]);
    }

    #[Route('/view', name: 'view', methods: ['GET'])]
    public function view(MessageRepository $messageRepository): Response
    {
        return $this->render('message/view.html.twig', [
            'messages' => $messageRepository->findAll(),
        ]);
    }

    #[Route('/run', name: 'run', methods: ['GET'])]
    public function run(): Response
    {
        return $this->render('message/run.html.twig');
    }

    #[Route('/get/{index}/{read}',
        name: 'get',
        requirements: ['index' => '\d+', 'read' => 'read|unread'],
        methods: ['GET'])]
    public function test(
        MessageRepository $messageRepository,
        int $index = 0,
        string $read = null
    ): Response
    {
        return $this->json([
            'messages' => $messageRepository->findMessageAfterId($index, $read),
        ]);

    }

    /**
     * @throws Exception
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Message $message, MessageRepository $messageRepository): Response
    {
        if ($message->isRead() === false) {
            $messageRepository->markReadAt($message);
        }

        return $this->render('message/show.html.twig', [
            'message' => $message,
        ]);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Message $message, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(MessageType::class, $message);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_message_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('message/edit.html.twig', [
            'message' => $message,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['POST'])]
    public function delete(Request $request, Message $message, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$message->getId(), $request->request->get('_token'))) {
            $entityManager->remove($message);
            $entityManager->flush();
        }

        return $this->redirectToRoute('admin_app_message_index', [], Response::HTTP_SEE_OTHER);
    }

    /**
     * @throws Exception
     */
    #[Route('/{id}/read', name: 'read', methods: ['GET'])]
    public function read(
        Message $message,
        MessageRepository $messageRepository): Response
    {
        if ($message->isRead() === false) {
            $messageRepository->markReadAt($message);
        }
        return $this->json([
            'read' => $message->isRead(),
        ]);
    }

    #[Route('/{id}/unread', name: 'unread', methods: ['GET'])]
    public function unread(
        Message $message,
        EntityManagerInterface $entityManager
    ): Response
    {
        if ($message->isRead() === true) {
            $message->setIsRead(false);
            $entityManager->flush();
        }
        return $this->json([
            'read' => $message->isRead(),
        ]);
    }
}
