pipeline {
    agent any

    environment {
        # Jenkins credentials ID for your SSH private key
        SSH_CREDENTIALS = 'pythonanywhere-ssh'
        # Replace with your PythonAnywhere username and host
        PA_USER = 'saqib9022ii'
        PA_HOST = 'saqib9022iipythonanywhere.com'
        # Backend directory on PythonAnywhere
        PA_BACKEND_PATH = '/home/saqib9022ii/mysite'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client/front-end') {
                    // Use Node 20 image for compatibility
                    script {
                        docker.image('node:20-bullseye').inside {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Deploy Backend to PythonAnywhere') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS]) {
                    // Copy backend files to PythonAnywhere
                    sh """
                    scp -r back-end/* ${env.PA_USER}@${env.PA_HOST}:${env.PA_BACKEND_PATH}/
                    ssh ${env.PA_USER}@${env.PA_HOST} \\
                        "cd ${env.PA_BACKEND_PATH} && pip install -r requirements.txt"
                    """
                }
            }
        }

        stage('Deploy Frontend to Server') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS]) {
                    sh """
                    scp -r client/front-end/dist/* ${env.PA_USER}@${env.PA_HOST}:${env.PA_BACKEND_PATH}/static/
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
