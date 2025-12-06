pipeline {
    agent {
        docker {
            image 'python:3.12-bullseye'  // Python + pip
            args '-u root:root'           // run commands as root
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
                # Install Node.js and npm
                apt-get update
                apt-get install -y curl gnupg
                curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                apt-get install -y nodejs

                # Create Python virtual environment
                python3 -m venv ${VENV_DIR}
                source ${VENV_DIR}/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                '''
            }
        }

        stage('Backend Test') {
            steps {
                sh '''
                source ${VENV_DIR}/bin/activate
                pytest tests/ || exit 1
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
                echo 'Deploy your app here (scp, ssh, etc.)'
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
