import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/redux/features/auth/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        username: fieldErrors.username?._errors[0] || "",
        password: fieldErrors.password?._errors[0] || "",
      });
      return;
    }

    // If validation passes
    setErrors({ username: "", password: "" });
    const resultAction = await dispatch(
      loginUser({ username: username, password: password })
    );

    if (loginUser.fulfilled.match(resultAction)) {
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed inset-0 w-fit h-fit m-auto">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username and password below to login.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="JaneDoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // required
              />
              {errors.username && (
                <span className="text-destructive">{errors.username}</span>
              )}
              {error && error === "Invalid Username" && (
                <span className="text-destructive">{error}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // required
              />
              {errors.password && (
                <span className="text-destructive">{errors.password}</span>
              )}
              {error && error === "Invalid Password" && (
                <span className="text-destructive">{error}</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
