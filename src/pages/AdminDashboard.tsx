import { useState } from "react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import AdminSidebar from "../components/admin/AdminSidebar";
import CompanyUsersModal from "../components/CompanyUsersModal";
import styles from "../styles/AdminDashboard.module.css";

import { useData } from "../context/DataContext";
import { useCompanies } from "../hooks/useCompanies";
import { useUsers } from "../hooks/useUsers";
import { useCreateCompany } from "../hooks/useCreateCompany";
import { useCreateUser } from "../hooks/useCreateUser";

import AddCompanyCard from "../components/admin/AddCompanyCard";
import AddUserCard from "../components/admin/AddUserCard";
import CompaniesTableCard from "../components/admin/CompaniesTableCard";

type Company = { id: string; name: string; createdAt: string };

export default function AdminDashboard() {
  const { getUsersByCompany } = useData();

  const { data: companiesData = [], isLoading: isLoadingCompanies } =
    useCompanies();
  const { isLoading: isLoadingUsers } = useUsers();

  const companies = companiesData as Company[];
  const isFetching = isLoadingCompanies || isLoadingUsers;

  const createCompanyMutation = useCreateCompany();
  const createUserMutation = useCreateUser();

  const [selectedCompanyForView, setSelectedCompanyForView] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [isLoadingCompanyUsers, setIsLoadingCompanyUsers] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getCompanyUsersDisplay = (companyId: string) => {
    const users = getUsersByCompany(companyId);
    if (!users?.length) return "No users";

    const valid = users.filter((u: any) => u.fullName);
    if (!valid.length) return "No users";

    return valid
      .map((u: any) => {
        const roleDisplay =
          u.role === "recruiter"
            ? "Recruiter"
            : u.role === "interviewer"
            ? "Interviewer"
            : u.role;
        return `${u.fullName} (${roleDisplay})`;
      })
      .join(", ");
  };

  const handleCreateCompany = (name: string) => {
    createCompanyMutation.mutate(name, {
      onError: (err: any) => {
        let message =
          err?.message || "Failed to create company. Please try again.";

        if (
          message.includes("Duplicate entry") &&
          message.includes("company_names_name_unique")
        ) {
          message =
            "This company name already exists. Please choose another name.";
        }

        toast.error(message);
      },
    });
  };

  const handleCreateUser = (payload: {
    name: string;
    email: string;
    password: string;
    company_id: string;
    role: "recruiter" | "interviewer";
  }) => {
    createUserMutation.mutate(payload, {
      onError: (err: any) => {
        toast.error(err?.message || "Failed to create user. Please try again.");
      },
    });
  };

  const handleOpenCompany = (company: { id: string; name: string }) => {
    setSelectedCompanyForView(company);
    setIsLoadingCompanyUsers(true);

    try {
      const users = getUsersByCompany(company.id);
      setCompanyUsers(users || []);
    } catch {
      setCompanyUsers([]);
      toast.error("Failed to load users for this company");
    } finally {
      setIsLoadingCompanyUsers(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCompanyForView(null);
    setCompanyUsers([]);
  };

  return (
    <>
      <AdminSidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <div className={styles.formsContainer}>
            <AddCompanyCard
              isSubmitting={createCompanyMutation.isPending}
              onSubmit={handleCreateCompany}
            />

            <AddUserCard
              companies={companies}
              isSubmitting={createUserMutation.isPending}
              onSubmit={handleCreateUser}
            />
          </div>

          <CompaniesTableCard
            companies={companies}
            isFetching={isFetching}
            formatDate={formatDate}
            getUsersDisplay={getCompanyUsersDisplay}
            onViewCompany={handleOpenCompany}
          />
        </div>
      </div>

      {selectedCompanyForView && (
        <CompanyUsersModal
          company={selectedCompanyForView}
          users={companyUsers}
          isLoading={isLoadingCompanyUsers}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
