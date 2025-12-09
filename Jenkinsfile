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

        stage('Setup Environment') {
            steps {
                sh '''
                python3 --version || (apt-get update && apt-get install -y python3 python3-venv python3-pip)

                python3 -m venv ${VENV_DIR}
                . ${VENV_DIR}/bin/activate

                pip install --upgrade pip
                if [ -f requirements.txt ]; then
                    pip install -r requirements.txt
                fi

                node -v
                npm -v
                '''
            }
        }

        stage('Backend Test') {
            steps {
                sh '''
                . ${VENV_DIR}/bin/activate
                if [ -d tests ]; then
                    pytest tests/
                else
                    echo "No tests directory found, skipping backend tests."
                fi
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                if [ -d ${FRONTEND_DIR} ]; then
                    cd ${FRONTEND_DIR}
                    npm install
                    npm run build
                else
                    echo "Frontend directory not found, skipping frontend build."
                fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '✅ Deploy stage - add deployment steps here'
            }
        }
    }

    post {
        success { echo '✅ Pipeline completed successfully!' }
        failure { echo '❌ Pipeline failed! Check logs.' }
    }
}
