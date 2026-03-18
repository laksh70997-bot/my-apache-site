pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        LAUNCH_TEMPLATE_ID = 'lt-06f15567231f11a60'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/laksh70997-bot/my-apache-site.git'
            }
        }

        stage('Validate') {
            steps {
                echo 'Checking files...'
                sh 'ls -la'
                sh 'test -f index.html && echo "index.html found"'
            }
        }

        stage('Launch Apache EC2') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds'
                ]]) {
                    sh """
                        aws ec2 run-instances \
                          --launch-template LaunchTemplateId=${LAUNCH_TEMPLATE_ID} \
                          --count 1 \
                          --tag-specifications \
                            'ResourceType=instance,Tags=[{Key=Name,Value=Apache-Deploy-${BUILD_NUMBER}}]'
                    """
                }
            }
        }
    }

    post {
        success { echo 'New Apache EC2 launched!' }
        failure { echo 'Pipeline failed. Check logs.' }
    }
}
