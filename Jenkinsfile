pipeline {
    agent any

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
                echo 'Installing Python and virtual environment...'
                sh '''
                sudo apt-get update
                sudo apt-get install -y python3 python3-venv python3-pip
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
                # Add deploy commands here
                '''
            }
        }
    }

    post {
        success { echo '✅ Pipeline completed successfully!' }
        failure { echo '❌ Pipeline failed. Check the logs.' }
    }
}
