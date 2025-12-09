pipeline {
    agent any

    environment {
        SSH_CREDENTIALS = 'pythonanywhere-ssh'      // Jenkins credential ID for your SSH key
        PA_USER        = 'saqib9022ii'             // PythonAnywhere username
        PA_HOST        = 'ssh.pythonanywhere.com'  // PythonAnywhere SSH host
        PA_BACKEND_PATH = '/home/saqib9022ii/mysite' // Backend directory on PythonAnywhere
        PA_FRONTEND_PATH = '/home/saqib9022ii/mysite/static' // Where to put built frontend
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
                    sh """
                        scp -r back-end/* ${env.PA_USER}@${env.PA_HOST}:${env.PA_BACKEND_PATH}/
                        ssh ${env.PA_USER}@${env.PA_HOST} \\
                            "cd ${env.PA_BACKEND_PATH} && pip install -r requirements.txt"
                    """
                }
            }
        }

        stage('Deploy Frontend to PythonAnywhere') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS]) {
                    sh """
                        scp -r client/front-end/dist/* ${env.PA_USER}@${env.PA_HOST}:${env.PA_FRONTEND_PATH}/
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
