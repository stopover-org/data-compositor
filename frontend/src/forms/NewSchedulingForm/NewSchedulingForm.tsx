"use client";

import { memo, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { graphql, useMutation } from "react-relay";
import {
  AdapterType,
  NewSchedulingForm_CreateSchedulingMutation,
  NewSchedulingForm_CreateSchedulingMutation$variables,
} from "@/forms/NewSchedulingForm/__generated__/NewSchedulingForm_CreateSchedulingMutation.graphql";
import { useRouter } from "next/navigation";

const schema = yup
  .object({
    name: yup.string().required(),
    retentionPeriod: yup.number().moreThan(-1).integer(),
    maxRetries: yup.number().moreThan(-1).integer(),
    adapterType: yup.string().required(),
    configuration: yup.string().required(),
  })
  .required();

const NewSchedulingForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [commitMutation, isMutationInFlight] =
    useMutation<NewSchedulingForm_CreateSchedulingMutation>(graphql`
      mutation NewSchedulingForm_CreateSchedulingMutation(
        $input: SchedulingInput!
      ) {
        createScheduling(input: $input) {
          id
          configuration
          adapterType
          status

          retentionPeriod
          maxRetries
        }
      }
    `);

  const mutate = useCallback(
    async (variables: NewSchedulingForm_CreateSchedulingMutation$variables) => {
      if (isMutationInFlight) {
        return;
      }

      commitMutation({ variables });

      router.push("/scheduler");
    },
    [commitMutation, isMutationInFlight, router],
  );
  const adapterTypes: AdapterType[] = useMemo(() => ["TEST_ADAPTER"], []);

  return (
    <form
      className="flex flex-col w-full"
      onSubmit={handleSubmit((data) =>
        mutate({
          input: { ...data, adapterType: data.adapterType as AdapterType },
        }),
      )}
    >
      <div className="space-y-12 w-full">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-3xl font-semibold leading-7 text-gray-900">
            New Scheduling
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Scheduling Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="name"
                    type="text"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    {...register("name")}
                  />
                </div>
                <span className="text-sm text-red-500 mt-1 ml-1">
                  {errors.name?.message}
                </span>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="retentionPeriod"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Retention Period
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md">
                  <input
                    id="retentionPeriod"
                    type="number"
                    defaultValue={0}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    {...register("retentionPeriod")}
                  />
                </div>
                <span className="text-sm text-red-500 mt-1 ml-1">
                  {errors.retentionPeriod?.message}
                </span>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="maxRetries"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Max Retries
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md">
                  <input
                    id="maxRetries"
                    type="number"
                    defaultValue={3}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    {...register("maxRetries")}
                  />
                </div>
                <span className="text-sm text-red-500 mt-1 ml-1">
                  {errors.maxRetries?.message}
                </span>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="configuration"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Configuration
              </label>
              <div className="mt-2">
                <textarea
                  id="configuration"
                  className="block w-full border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md"
                  {...register("configuration")}
                />
              </div>
              <span className="text-sm text-red-500 mt-1 ml-1">
                {errors.configuration?.message}
              </span>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="adapter_type"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Adapter Type
              </label>
              <div className="mt-2">
                <select
                  id="adapterType"
                  autoComplete="adapterType"
                  className="block w-full border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md"
                  {...register("adapterType")}
                >
                  {adapterTypes.map((adapter) => (
                    <option>{adapter}</option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-red-500 mt-1 ml-1">
                {errors.adapterType?.message}
              </span>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          Create Scheduling
        </button>
      </div>
    </form>
  );
};

export default memo(NewSchedulingForm);
