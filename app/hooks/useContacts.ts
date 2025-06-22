import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Contact } from '../database/types';
import { useDataReady } from './useDataReady';
import { useRepositories } from './useRepositories';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { contactRepository } = useRepositories();
  const isDataReady = useDataReady();

  const loadContacts = useCallback(async () => {
    try {
      if (!contactRepository) {
        return;
      }
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
  }, [contactRepository]);

  const loadContactsByType = useCallback(async (type: string) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
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
    // Only load contacts if data is ready and repository is available
    if (isDataReady && contactRepository) {
      loadContacts();
    }
    
    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "contacts" && contactRepository) {
        console.log("Contacts in local database have changed");
        loadContacts();
      }
    });
    return () => listener.remove();
  }, [loadContacts, contactRepository, isDataReady]);

  const addContact = useCallback(async (contact: Omit<Contact, 'id'>) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      const newContact = await contactRepository.createContact(contact);
      return newContact;
    } catch (err) {
      console.error('Error adding contact:', err);
      throw err;
    }
  }, [contactRepository]);

  const updateContact = useCallback(async (id: string, updates: Partial<Omit<Contact, 'id'>>) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      const success = await contactRepository.updateContact(id, updates);
      return success;
    } catch (err) {
      console.error('Error updating contact:', err);
      throw err;
    }
  }, [contactRepository]);

  const deleteContact = useCallback(async (id: string) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      const success = await contactRepository.deleteContact(id);
      return success;
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    }
  }, [contactRepository]);

  const getContactById = useCallback(async (id: string): Promise<Contact | null> => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
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
    getContactById,
    loadContactsByType
  };
} 