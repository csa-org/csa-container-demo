# Start Wars Website - A Container Demo
This is a simple website that demonstrates how to containerize a website using Docker. The website is a simple Star Wars themed website that displays a list of Star Wars characters and their details. The website is built using HTML, CSS, and JavaScript and is deployed using a Node.js express web server.


## Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/en/download/) (optional)
- [npm](https://www.npmjs.com/get-npm) (optional)


## Demo Steps - Images, Containers, and Registries

### Understanding the Project Structure
1. Clone the repository and talk about it's structure

2. Have everyone make the following change in the public/index.html file:
    - Change: `<title>Star Wars Web App</title>` (line 6)
    - To: `<title>Star Wars Web App - <Your Name></title>`

## Building the Image and Running the Container
3. Build the Docker image
    ```bash
    docker build -t apartment-blueprint .
    ```

4. View the Docker image
    ```bash
    docker images
    ```

5. Create and run a container from the image
    ```bash
    docker run -itd --rm --name apartment -p 8000:8000 apartment-blueprint
    ```

    Where: 
        - `-i`: interactive (i.e., keep STDIN open)
        - `-t`: terminal (i.e., allocate a pseudo-TTY)
        - `-d`: detached (i.e., run in the background)
        - `--rm`: delete the container when it stops 
        - `--name apartment`: name the container 'apartment'
        - `-p 8000:8000`: map port 8000 on our local host to port 8000 in the container 
        - `apartment-blueprint`: the image to use for the container

6. Confirm the container started up successfully
    ```bash
    docker ps
    ```

7. Open a web browser and navigate to `http://localhost:8000` to view/play around with the website

8. Let's shell into the container and poke around
    ```bash
    docker exec -it apartment /bin/bash
    ```

    Where:
        - `exec`: execute a command in a running container
        - `-it`: spin up an interactive terminal (i.e., keep STDIN open and allocate a pseudo-TTY)
        - `apartment`: the name of the container we want to shell into
        - `/bin/bash`: the command to run inside the container

9. After executing the command, we are now in a fully isolated Debian Linux environment. We can poke around, view files, and run commands such as:
    - List the project files that we copied over from our local machine:
        ```bash
        ls -l
        ```
    - Or do something crazy with the package we installed in the Dockerfile:
        ```bash
        aafire
        ```
    - To exit the container, type `exit`

10. Stop the container, thereby deleting it
    ```bash
    docker stop apartment
    ```

11. Confirm the container was deleted
    ```bash
    docker ps -a
    ```

12. Let's login to a container registry that isn't Docker Hub
    ```bash
    docker login portus.sr-homelab.com
    ```

    Where:
        - `portus.sr-homelab.com`: the registry URL of a private container registry
    
    **NOTE: A CSA will provide you with the credentials.**

13. Tag the image for the private registry
    ```bash
    docker tag apartment-blueprint portus.sr-homelab.com/csa-container-demo/apartment-blueprint:"$(whoami)"
    ```

    Where:
        - `apartment-blueprint`: the name of our existing image we already built
        - `portus.sr-homelab.com`: the registry URL of a private container registry
        - `csa-container-demo`: the namespace to push the image to within the container registry (similar to an ECR repository)
        - `csa-container-demo`: the name to give the image in the private registry
        - `$(whoami)`: the tag of the image in the private registry (in this case, it's the username of the person running the command)

14. Push the image to the private registry
    ```bash
    docker push portus.sr-homelab.com/csa-container-demo
    ```

15. CSA to show the different tagged images in the private registry
    - Registry UI: `http://portus.sr-homelab.com`
    - Credentials: `Provided by Scott`

16. (BONUS) If you want, you can now start a container using the image from the private registry
    ```bash
    docker run -itd --rm --name apartment -p 8000:8000 portus.sr-homelab.com/csa-container-demo/apartment-blueprint:"$(whoami)"
    ```
    
    **NOTE: This command is the same as the one we ran earlier, but we're using the image from the private registry.**


## Demo Steps - LW Inline Scanner (optional, if time permits)
1. Download the latest version of the Lacework Inline Scanner to this directory (or any directory of your choice)
    - For Linux systems, follow these steps: https://docs.lacework.net/console/local-scanning-quickstart#installation-linux
    - For Mac systems, follow these steps: https://docs.lacework.net/console/local-scanning-quickstart#installation-mac

2. Once the `lw-scanner` is downloaded and executable, we need to authenticate
    ```bash
    ./lw-scanner configure auth
    ```

    **NOTE: A CSA will provide you with credentials, or you may use your own Lacework Account and Inline Scanner Authorization Token.**

3. Execute a local vulnerability assessment of the Docker image we pushed to the private registry (i.e., `portus.sr-homelab.com`) and output the results to an HTML file
    ```bash
    ./lw-scanner image evaluate portus.sr-homelab.com/csa-container-demo/apartment-blueprint "$(whoami)" \
        --html \
        --html-file 'apartment-blueprint-vulnerability-assessment.html'
    ```

    **NOTE: The `csa-container-demo` registry namespace has been set to Public Read Access so that we can run this command without needing to authenticate. If you're using your own registry, you'll need to authenticate using the `--docker-username` and `--docker-password` flags OR setup and use the [Lacework Proxy Scanner](https://docs.lacework.net/onboarding/integrate-proxy-scanner).**

4. Once finished, open the HTML file in your browser to view the results in a nice format
