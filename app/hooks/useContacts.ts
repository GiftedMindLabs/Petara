import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Contact } from '../database/types';
import { useRepositories } from './useRepositories';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { contactRepository } = useRepositories();

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await contactRepository.getAllContacts();
      setContacts(data);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const loadContactsByType = useCallback(async (type: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await contactRepository.getContactsByType(type);
      setContacts(data);
    } catch (err) {
      console.error('Error loading contacts by type:', err);
      setError('Failed to load contacts by type');
    } finally {
      setIsLoading(false);
    }
  }, [contactRepository]);

  useEffect(() => {
    loadContacts();
    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "contacts") {
        console.log("Contacts in local database have changed");
        loadContacts();
      }
    });
    return () => listener.remove();
  }, [loadContacts]);

  const addContact = useCallback(async (contact: Omit<Contact, 'id'>) => {
    try {
      const newContact = await contactRepository.createContact(contact);
      return newContact;
    } catch (err) {
      console.error('Error adding contact:', err);
      throw err;
    }
  }, [contactRepository]);

  const updateContact = useCallback(async (id: string, updates: Partial<Omit<Contact, 'id'>>) => {
    try {
      const success = await contactRepository.updateContact(id, updates);
      return success;
    } catch (err) {
      console.error('Error updating contact:', err);
      throw err;
    }
  }, [contactRepository]);

  const deleteContact = useCallback(async (id: string) => {
    try {
      const success = await contactRepository.deleteContact(id);
      return success;
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    }
  }, [contactRepository]);

  const getContactById = useCallback(async (id: string): Promise<Contact | null> => {
    try {
      return await contactRepository.getContactById(id);
    } catch (err) {
      console.error('Error getting contact by id:', err);
      throw err;
    }
  }, [contactRepository]);

  return {
    contacts,
    isLoading,
    error,
    addContact,
    updateContact,
    deleteContact,
    getContactById
  };
} 