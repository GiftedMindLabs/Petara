  import { useState } from "react";
import { Contact } from "../database/types";
import { useRepositories } from "./useRepositories";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { contactRepository } = useRepositories();

  const loadContacts = async () => {
    console.log("useContacts loadContacts called");
    try {
      setIsLoading(true);
      setError(null);
      const loadedContacts = await getAllContacts();
      console.log("useContacts loadContacts loaded contacts:", loadedContacts?.length || 0);
      setContacts(loadedContacts || []);
    
    } catch (err) {
      console.error("useContacts loadContacts error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllContacts = async () => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      return await contactRepository.getAllContacts();
    } catch (err) {
      console.error("Error getting all contacts:", err);
      throw err;
    }
  };

  const loadContactsByType = async (type: string) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      return await contactRepository.getContactsByType(type);
    } catch (err) {
      console.error('Error getting contacts by type:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };



  const addContact = async (contact: Omit<Contact, 'id'>) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
        return await contactRepository.createContact(contact);
    } catch (err) {
      console.error('Error adding contact:', err);
      throw err;
    }
    };

  const updateContact = async (id: string, updates: Partial<Omit<Contact, 'id'>>) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      return await contactRepository.updateContact(id, updates);
    } catch (err) {
      console.error('Error updating contact:', err);
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      return await contactRepository.deleteContact(id);
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    }
  };

  const getContactById = async (id: string): Promise<Contact | null> => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      return await contactRepository.getContactById(id);
    } catch (err) {
      console.error('Error getting contact by id:', err);
      throw err;
    }
  };

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