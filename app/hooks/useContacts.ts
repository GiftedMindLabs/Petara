import { useCallback, useEffect, useState } from "react";
import { Contact } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now()); // Force re-render
  const { contactRepository } = useRepositories();
  const isDataReady = useDataReady();

  console.log("useContacts hook re-rendering, contacts count:", contacts?.length || 0, "timestamp:", refreshTimestamp);

  const loadContacts = useCallback(async () => {
    console.log("useContacts loadContacts called");
    if (!contactRepository || !isDataReady) {
      console.log("useContacts loadContacts - repository or data not ready");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedContacts = await contactRepository.getAllContacts();
      console.log("useContacts loadContacts loaded contacts:", loadedContacts?.length || 0);
      setContacts(loadedContacts || []);
      setRefreshTimestamp(Date.now()); // Force re-render
    } catch (err) {
      console.error("useContacts loadContacts error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  }, [contactRepository, isDataReady]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    console.log("useContacts refresh called");
    try {
      if (contactRepository) {
        const loadedContacts = await contactRepository.getAllContacts();
        console.log("useContacts refresh loaded contacts:", loadedContacts?.length || 0);
        setContacts(loadedContacts || []);
        setError(null);
        setRefreshTimestamp(Date.now()); // Force re-render
      }
    } catch (err) {
      console.error("useContacts refresh error:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh contacts');
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
    console.log("useContacts useEffect triggered, isDataReady:", isDataReady, "contactRepository:", !!contactRepository);
    if (isDataReady && contactRepository) {
      loadContacts();
    }
  }, [isDataReady, contactRepository, loadContacts, refreshTimestamp]);

  const addContact = useCallback(async (contact: Omit<Contact, 'id'>) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      const newContact = await contactRepository.createContact(contact);
      // Refresh contacts after adding
      refresh();
      return newContact;
    } catch (err) {
      console.error('Error adding contact:', err);
      throw err;
    }
  }, [contactRepository, refresh]);

  const updateContact = useCallback(async (id: string, updates: Partial<Omit<Contact, 'id'>>) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      const success = await contactRepository.updateContact(id, updates);
      // Refresh contacts after updating
      refresh();
      return success;
    } catch (err) {
      console.error('Error updating contact:', err);
      throw err;
    }
  }, [contactRepository, refresh]);

  const deleteContact = useCallback(async (id: string) => {
    try {
      if (!contactRepository) {
        throw new Error("Contact repository not available");
      }
      const success = await contactRepository.deleteContact(id);
      // Refresh contacts after deleting
      refresh();
      return success;
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    }
  }, [contactRepository, refresh]);

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
    refresh,
    addContact,
    updateContact,
    deleteContact,
    getContactById,
    loadContactsByType
  };
} 