### Introduction

This is simple project to share the very basic workings of the serverless framework by creating a simple HTTP endpoint as your backend.

To simply see all the possible syntax for SLS you can go here:
https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml/

## Installation
To get started install serverless using npm install -g serverless and check the version using sls -v
ref: https://www.serverless.com/framework/docs/providers/aws/guide/quick-start/

Note: Ensure that that you CD into the root of your serverless file to use the serverless cli.

## Packaging
  We will use the serverless-bundle plugin to make packaging easier (https://www.npmjs.com/package/serverless-bundle)

  Ensure the package attribute is set:
  package:
    patterns:
      - "!node_modules/"

## Deployment
sls deploy (will package and deploy for you)

## Testing
  Checklist:
    - When you are testing ensure that the stage under the provider section in your sls.yml file is set to 'dev'.
    - Double-check your region.
    - Ensure your runtime is correct (you can set your runtime individually for each function).

  To test locally:
    - sls deploy
    - sls invoke local --function getMovie --data  tests/payload.json 
  # NOTE: Make sure to deploy first.

### Adding Layers

Layers are for any dependencies you may need for your project.

  - Add a layers folder to your project 
  - Run npm install --prefix <path/to/layer_folder> <package_name>
  - Add the layer in the layer section of your serverless.yml file

  Example:
    layers:
      mysql:
        path: layers
        description: MYSQL Layer
        compatibleRuntimes:
          - nodejs12.x

To use the layer in your lambda function you can add it as seen below:
  functions:
    getMovie:
      handler: tests/getMovie.handler
      layers:
        - { Ref: MysqlLambdaLayer } # add your layers here
      package:
        patterns:
          - "!**"
          - tests/**
        individually: true
      events:
        - http:
            path: getMovie
            method: get

## Adding functions
  functions:
    getMovie:
      handler: tests/getMovie.handler
      layers:
        - { Ref: MysqlLambdaLayer }
      package:
        patterns:
          - "!**"
          - tests/**
        individually: true 
      events:
        - http:
            path: getMovie
            method: get

  - Handler points to your function where 'handler' in the example is the NAME of your function.
  - Package specify what to include and what not to (to make the function lighter).
  - Events specify the path and method of the function.

  # Note: Your lambda function will return error if you dont return the following format
  Example:
    {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello Ken!',
      }),
    };

### Using Parameter Store
  You can use the aws-sdk SSM getParameter function to do so.

### Connecting to DB

  - Go to the security group of the rds db that you are working with.
  - Add an inbound rule with type: MYSQL/Aurora, Source: My IP, Port Range: <the port of your rds, can be found in your RDS page> (this is so that you can access the DB)
  - Click on save rules
  - In your provider section you can specify the VPC with the subnets your project will be operating under as in line 8 in serverless.yml

  Example:
    vpc:
      securityGroupIds:
        - sg-070ddb18626667b37
      subnetIds:
        - subnet-0ee3da1f2c6ef815c
        - subnet-07de42066e68b40ed
        - subnet-09e0d868e857045fd

  This will ensure that your lambda function will have access to the DB as well.

### Querying from DB

We will use the mysql and util packages to make our test query

Make sure to create the pool outside of your handler so it can re-use the connection instead of connecting every time its run.

# Note: I used the util package to make the code more concise and make it easier to resolve the promise. You can do it according to your project's specification.