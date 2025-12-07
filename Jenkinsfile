pipeline {
    agent {
        docker {
            image 'node:18-bullseye'
            args '-u root'
        }
    }

    environment {
        VENV_DIR = "${WORKSPACE}/venv"
        FRONTEND_DIR = "${WORKSPACE}/frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                sh '''
                apt-get update
                apt-get install -y python3 python3-venv python3-pip

                python3 -m venv ${VENV_DIR}
                . ${VENV_DIR}/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt

                node -v
                npm -v
                python --version
                '''
            }
        }

        stage('Backend Test') {
            steps {
                sh '''
                . ${VENV_DIR}/bin/activate
                pytest tests/
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                cd ${FRONTEND_DIR}
                npm install
                npm run build
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy here...'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs.'
        }
    }
}
