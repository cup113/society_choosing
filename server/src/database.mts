import PocketBase from 'pocketbase';
import 'dotenv/config';

const get_pb = () => new PocketBase("http://localhost:8090");

export default get_pb;
