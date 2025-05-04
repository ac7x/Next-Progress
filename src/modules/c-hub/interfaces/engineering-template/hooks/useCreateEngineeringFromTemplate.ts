import { createEngineeringFromTemplate } from '@/modules/c-hub/application/engineering-instance/engineering-instance.usecase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateEngineeringFromTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEngineeringFromTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['engineerings'] });
        }
    });
}