import { useState } from 'react';
import { Box, Typography, Button, Card, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer
} from '../../hooks/useCustomers';
import { CustomerListTable } from '../../components/Customer/CustomerListTable';
import { CustomerDetailsDrawer } from '../../components/Customer/CustomerDetailsDrawer';
import { CustomerFormModal } from '../../components/Customer/CustomerFormModal';
import { useToast } from '../../components/Common/ToastProvider';
import { useDebounce } from '../../hooks/useDebounce';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { Loader } from '../../components/Common/Loader';
import { ErrorState } from '../../components/Common/ErrorState';
import { EmptyState } from '../../components/Common/EmptyState';
import type { Customer } from '../../types';
import type { CustomerFormValues } from '../../schemas/customerSchemas';

export const Customers = () => {
  const { data: customers = [], isLoading, isError, refetch } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Selected customer state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filter logic
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Handlers
  const handleAddClick = () => {
    setSelectedCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setSelectedCustomer(customer);
      setIsFormModalOpen(true);
    }
  };

  const handleViewClick = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setSelectedCustomer(customer);
      setIsDrawerOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setSelectedCustomer(customer);
      setIsConfirmOpen(true);
    }
  };

  const handleFormSubmit = async (data: CustomerFormValues) => {
    try {
      if (selectedCustomer) {
        await updateCustomerMutation.mutateAsync({ id: selectedCustomer.id, data });
        showToast('Customer updated successfully', 'success');
      } else {
        await createCustomerMutation.mutateAsync(data);
        showToast('Customer added successfully', 'success');
      }
      setIsFormModalOpen(false);
    } catch (_error) {
      showToast('An error occurred while saving the customer', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      try {
        await deleteCustomerMutation.mutateAsync(selectedCustomer.id);
        showToast('Customer deleted successfully', 'success');
        setIsConfirmOpen(false);
        setSelectedCustomer(null);
      } catch (_error) {
        showToast('Failed to delete customer', 'error');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }} color="text.primary" gutterBottom>
            Customers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customer database and view their details.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="large" onClick={handleAddClick} aria-label="Add new customer">
          Add Customer
        </Button>
      </Box>

      {/* Main Content Area */}
      <Card sx={{ p: 0 }}>
        {/* Toolbar */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder="Search customers..."
            sx={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Content State */}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState message="Failed to load customers." onRetry={() => refetch()} />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            icon={<PeopleOutlineOutlinedIcon />}
            title={searchTerm ? 'No matches found' : 'No customers found'}
            description={searchTerm ? 'Try adjusting your search term.' : 'Get started by adding your first customer.'}
            actionText={!searchTerm ? 'Add Customer' : undefined}
            onAction={!searchTerm ? handleAddClick : undefined}
          />
        ) : (
          <CustomerListTable
            customers={filteredCustomers}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </Card>

      <CustomerFormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCustomer}
        isSubmitting={createCustomerMutation.isPending || updateCustomerMutation.isPending}
      />

      <CustomerDetailsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        customer={selectedCustomer}
      />

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isProcessing={deleteCustomerMutation.isPending}
      />
    </Box>
  );
};
