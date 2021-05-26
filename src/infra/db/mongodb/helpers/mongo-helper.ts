import { Collection, MongoClient } from 'mongodb'
export const MongoHelper = {
  client: null as MongoClient, // to type a value from an object, we use "as"
  uri: null as String, // to type a value from an object, we use "as"

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map (collection): any {
    const { _id, ...collectionWithoutId } = collection // we define our id to have only "id" and not "_id". So we will remove the _id and insert the new id
    return { ...collectionWithoutId, id: _id }
  }
}
