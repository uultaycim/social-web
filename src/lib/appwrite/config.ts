import {Client, Account, Databases, Storage, Avatars} from 'appwrite'

export const appwriteConfig = {
    projectId: '65f159ae4f7e1f95687d',
    url: 'https://cloud.appwrite.io/v1',
    databaseId: '65f952cfc20a6d2aeb94',
    storageId: '65f952922cd4efcf9f64',
    userCollectionId: '65f953ac86e83ad6db92',
    postCollectionId: '65f9536319d4f72d4705',
    savesCollectionId: '65f953d7efc793c5d056',
    messagesCollection:'66364a610036c1d8a7f8',
    conversationCollection:'66364c8400237b4d40ac'

}
export const client = new Client()

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)
