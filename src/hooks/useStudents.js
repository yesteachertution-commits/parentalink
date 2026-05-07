import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';

export const useStudents = (options = {}) => {
  const { page = 1, limit = 50, classes = '' } = options;
  
  return useQuery({
    queryKey: ['students', { page, limit, classes }],
    queryFn: () => studentApi.getStudents({ page, limit, classes }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useStudentMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: studentApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: studentApi.updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: studentApi.bulkDeleteStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const attendanceMutation = useMutation({
    mutationFn: studentApi.saveAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const gradeMutation = useMutation({
    mutationFn: studentApi.updateGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const deleteGradeMutation = useMutation({
    mutationFn: studentApi.deleteGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    bulkDeleteMutation,
    attendanceMutation,
    gradeMutation,
    deleteGradeMutation
  };
};

export const useNotifications = () => {
  const attendanceNotify = useMutation({
    mutationFn: studentApi.notifyAttendance,
  });

  const marksNotify = useMutation({
    mutationFn: studentApi.notifyMarks,
  });

  return {
    attendanceNotify,
    marksNotify
  };
};
