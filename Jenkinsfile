pipeline {
  agent any

  environment {
    IMAGE_NAME = 'tihcl-frontend'
    CONTAINER_NAME = 'tihcl-frontend-container'
  }

  stages {

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $IMAGE_NAME .'
      }
    }

    stage('Stop Existing Container') {
      steps {
        sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
      }
    }

    stage('Run Docker Container') {
      steps {
        sh '''
                docker run -d \
                  --name $CONTAINER_NAME \
                  -p 3000:80 \
                  $IMAGE_NAME
                '''
      }
    }
  }

  post {
    success {
      echo 'Frontend deployed successfully.'
    }

    failure {
      echo 'Frontend deployment failed.'
    }
  }
}
