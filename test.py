import boto3

session = boto3.Session(profile_name="AWSSandboxAdmin-978983596161")
client = session.client("sts")
print(client.get_caller_identity())
