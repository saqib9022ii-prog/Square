pipeline {
    agent {
        docker {
            // Use Node 20 (includes npm) and install Python on the fly
            image 'node:20-bullseye'
            args '-v /var/jenkins_home:/var/jenkins_home' // optional volume
        }
    }

    environment {
        VENV_DIR = "${WORKSPACE}/venv"
        FRONTEND_DIR = "${WORKSPACE}/frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Setup Python') {
            steps {
                echo 'Installing Python and setting up virtual environment...'
                sh '''
                apt-get update
                apt-get install -y python3 python3-venv python3-pip
                python3 -m venv ${VENV_DIR}
                source ${VENV_DIR}/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                '''
            }
        }

        stage('Backend Test') {
            steps {
                echo 'Running backend tests...'
                sh '''
                source ${VENV_DIR}/bin/activate
                pytest tests/ || exit 1
                '''
            }
        }

        stage('Setup Frontend') {
            steps {
                echo 'Installing frontend dependencies and building...'
                sh '''
                cd ${FRONTEND_DIR}
                npm install
                npm run build
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying project...'
                sh '''
                # Example deploy commands:
                # scp -r * user@server:/path/to/project
                # ssh user@server 'systemctl restart myapp'
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check the logs.'
        }
    }
}
