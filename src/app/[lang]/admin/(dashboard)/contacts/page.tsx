import { getAdminContacts } from './actions';
import { ContactsClient } from './ContactsClient';

export default async function ContactsPage() {
  const { items, attachmentLinks } = await getAdminContacts();
  return <ContactsClient initialItems={items} attachmentLinks={attachmentLinks} />;
}
