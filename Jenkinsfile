pipeline {
    agent any
    environment {
        VENV_DIR = "${WORKSPACE}/venv"
        FRONTEND_DIR = "${WORKSPACE}/frontend"
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Setup Environment') {
            steps {
                sh '''
                # Create Python virtual environment
                python3 -m venv ${VENV_DIR}
                source ${VENV_DIR}/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt

                # Install Node if not present (optional)
                node --version || sudo apt-get update && sudo apt-get install -y nodejs npm
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
            steps { echo 'Deploy here...' }
        }
    }
    post {
        success { echo '✅ Pipeline completed successfully!' }
        failure { echo '❌ Pipeline failed! Check logs.' }
    }
}
