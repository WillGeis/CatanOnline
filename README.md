# Incolae Terrae

Author: Will Geister

CEO: Will Geister

Frontend Engineer: Will Geister

Frontend Designer: Will Geister

Backend Engineer: Will Geister

Product Owner: Will Geister

Project Manager: Will Geister

Scrum Master: Will Geister

## Table of Contents

 - [How to Run the Game](how_to_run_the_game)
    - [Downloading the Backend](downloading_the_backend)
 - [Intro](intro)
 - [Basic Architecture](basic_architecture)
 - [Additional help](additional_help)
 - [Citations](citations)

## How to Run the Game

This game is not run conventionally--I do not host any servers--so you will need to run the backend that other players will connect to via Cloudflare tunnel. If you do not want to run the exe on your computer, fine, go ahead and download every file from Backend (`./Backend/~`) and run `dotnet run` in the command line inside the folder, you are welcome to view all the C# code, it is all in `Program.cs`.

#### Downloading the Backend

Navigate to this file (`BackendRelease`):

<img width="954" height="701" alt="image" src="https://github.com/user-attachments/assets/d710b398-2324-4fa0-84ec-8959eb6483fe" />

Navigate into the `.exe` file (`Backend.exe`):

<img width="746" height="215" alt="image" src="https://github.com/user-attachments/assets/af9ba378-0dec-4540-9a83-1e60f6164378" />

Click the `raw` button to download the `.exe`:

<img width="1363" height="209" alt="image" src="https://github.com/user-attachments/assets/c23b5326-38f7-4719-bfa5-f5ad7a7e7c94" />

Navigate to your downloads and click the `Backend.exe`

<img width="476" height="203" alt="image" src="https://github.com/user-attachments/assets/d7645963-982e-4abc-8438-7bb08ee328f6" />

Click "Open":

<img width="286" height="450" alt="image" src="https://github.com/user-attachments/assets/e79f5b3a-fbe9-46af-ad43-99abc9a4fcd4" />

Click "***More Information***":

<img width="537" height="502" alt="image" src="https://github.com/user-attachments/assets/8f970f40-882d-4e71-8ae5-c9cd5c65fe43" />

Click "**Run anyway**::

<img width="535" height="505" alt="image" src="https://github.com/user-attachments/assets/fa54c0a9-8eff-4a20-8ddc-0c2ce6aba08b" />

This is your server running, **DO NOT CLOSE THIS OR YOUR GAME WILL END**:

<img width="978" height="511" alt="image" src="https://github.com/user-attachments/assets/ebaddc4e-6e7c-4915-973c-6bb0a204cd48" />

Wait for this line `[CLOUDFLARE TUNNEL] Public URL: https://rand_word0-rand_word1-rand_word2-rand_word3.trycloudflare.com` comes up where `rand_word#` is a random word assigned by cloudflare before trying to start a game.

Note that the public URL that you are given is needed for this box:

<img width="686" height="496" alt="image" src="https://github.com/user-attachments/assets/05dc7c31-9760-4f48-8f01-a83e40bbb0da" />


## Intro

My friends were sad that board games that are typically easy to add players to (i.e. purchase cheap packs of pieces) are not as easy to add players to on their online versions. This is despite the fact that it is as simple as setting player counts to not be bounded, yet these online versions often charge **higher prices** than their physical counterparts.

I made the remark that "I can build a game in 6 months that is better than this, and I will do it for free." This game is exactly that, all code has been written exclusively by me (except clearly demarkated areas that I had AI write serializers etc) and it is free to host. Additionally hosting will *always* be free, insofar as the host is willing to host the server on their own compute space (a la minecraft java edition).

## Basic Architecture

This game works on a turn based engine that is run exclusively on the backend game server, developed specifically for this game by Will Geister. Player turn information, connection information, etc comes from REST calls and Signlr calls via the front/backends depending on the flow of information.

This drawing is how the backend imagines the game board, and is theoretically going to be scalable to any sized map and shaped map, or maps with additional resorce types, etc.
<img width="920" height="892" alt="TileAssociation" src="https://github.com/user-attachments/assets/832ed6b1-5ed7-4b4c-9729-3fb2ef90cc2e" />

## Additional help

**Code Reviewers**

Javascript Expert: Brian Lin

Server Based Compute Expert: Addison Adkin

## Citations

Inspiration: Catan and associated expansion packs.

Initial test sprites: Skyrim, UW Madison Friends of the Arboretum, Getty Stock Images
